var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const passport = require('passport');
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'dbproject'
});

// 권한없는 페이지 접근 처리 하는 middleware
var checkAuth_page = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login');
}

// 권한없는 api 요청 처리 하는 middleware
var checkAuth_api = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({message: '권한 없음'});
}

router.get('/', checkAuth_page, function(req, res, next) {
    res.redirect('/admin/dashboard');
});

router.get('/login', function(req, res, next) {
    res.render('admin/login', {title: '예방접종 사전예약 시스템'});
});

router.post('/login', passport.authenticate('local-admin', {
    failureRedirect: '/admin/login'
}), function(req, res, next) {
    req.session.save(function (err) {
        res.redirect('/admin');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.destroy(function (err) {
        res.redirect('/admin/login');
    });
});

router.get('/dashboard', checkAuth_page, function(req, res, next) {
    pool.getConnection(function(err,connection){    
        
    var sql_date = "SELECT * FROM vaccine_date;";
    var sql_age = "SELECT * FROM vaccine_age;";

        connection.query(sql_date,function(err,rows){
            if(err) console.error("err : " + err);

            console.log("row: " + JSON.stringify(rows));
            
            connection.query(sql_age,function(err,rows2){
            if(err) console.error("err : " + err);
    
            console.log("row2: " + JSON.stringify(rows2));
                        
            res.render('admin/dashboard',{title : '예방접종 사전예약 시스템',rows: rows,rows2: rows2});
            connection.release();
            
    
            });
        });
    });
});

/* 병원 1곳 단위의 백신 수량 및 예약 관리 페이지 */
router.get('/hospitals/individual-management', checkAuth_page, function(req, res, next) {
    res.render('admin/hospitals/individual_management', {title: '예방접종 사전예약 시스템'});
});

/* 모든 구, 동 목록 조회 */
router.get('/location-data', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        let query = 
        `
            SELECT l.location_name, sl.sublocation_name
            FROM location l
                inner join sublocation sl
                    on l.location_id = sl.L_id
            ORDER BY l.location_name, sl.sublocation_name 
        `;
        connection.query(query, function(err, rows) {
            if(err) {
                next(err);
            }
            else {
                let location_data = {};
                for (const row of rows) {
                    if (location_data[row['location_name']] === undefined) {
                        location_data[row['location_name']] = [];
                    }
                    location_data[row['location_name']].push(row['sublocation_name']);
                }

                res.json(location_data);
            }
            
            connection.release();
        });
    });
});

/* 병원 목록 dataTables 에 대한 server side processing */
router.get('/hospitals/data-tables-source', checkAuth_api, function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if(err) next(err);

        let location_filter = req.query.columns[2].search.value;
        let sublocation_filter = req.query.columns[3].search.value;

        let where_clause = '';
        if (location_filter) {
            where_clause += 'WHERE l.location_name = ' + connection.escape(location_filter);
            if (sublocation_filter) {
                where_clause += ' and sl.sublocation_name = ' + connection.escape(sublocation_filter);
            }
        }
        
        let query =
        `
            SELECT SQL_CALC_FOUND_ROWS 
                h.hospital_name, h.hospital_location, l.location_name, sl.sublocation_name, h.hospital_id
            FROM hospitals h
                inner join sublocation sl
                    on sl.sublocation_id = h.SL_id
                inner join location l
                    on l.location_id = sl.L_id
            ${where_clause}
            ORDER BY l.location_name, sl.sublocation_name, h.hospital_name
            ${req.query.length != -1 && 'LIMIT ' + connection.escape(Number(req.query.length)) + ' OFFSET ' + connection.escape(Number(req.query.start))}
        `;

        connection.query(query, function(err, rows) {
            if(err) {
                next(err);
                connection.release();
            }
            else {
                let hospitalRows = rows

                connection.query('SELECT FOUND_ROWS()', function(err, rows) {
                    if(err) {
                        next(err);
                    }
                    else {
                        res.json({
                            draw: Number(req.query.draw),
                            recordsTotal: rows[0]['FOUND_ROWS()'],
                            recordsFiltered: rows[0]['FOUND_ROWS()'],
                            data: hospitalRows
                        });
                    }

                    connection.release();
                });
            }
        });
    });
});

/* 특정 병원의 백신 보유량 조회 */
router.get('/hospitals/:id/vaccine-quantities', checkAuth_api, function(req, res, next) {    
    pool.getConnection(function(err, connection) {
        if(err) next(err);
        
        let query =
        `
            SELECT v.vaccine_name, v.vaccine_manufacturer, hv.vaccine_quantity, v.vaccine_id
            FROM hospital_vaccine hv
                natural join vaccine v
            WHERE hv.hospital_id = ?
        `;

        connection.query(query, [req.params.id], function(err, rows) {
            if (err)  {
                next(err);
            }
            else {
                res.json({
                    data: rows // dataTables 호환 format
                });
            }

            connection.release();
        });
    });
});

/* 특정 병원의 백신 보유량 수정 */
router.put('/hospitals/:id/vaccine-quantities', checkAuth_api, function(req, res, next) {    
    pool.getConnection(function(err, connection) {
        if(err) next(err);

        let query =
        `
            UPDATE hospital_vaccine
            SET vaccine_quantity = (
                case
                ${'when vaccine_id = ? then ? '.repeat(req.body.length)} 
                end
            )
            WHERE hospital_id = ?
        `;

        connection.query(query, [req.body.map((el) => Object.values(el)).flat(), req.params.id].flat(), function(err, rows) {
            if (err) {
                next(err);
            } 
            else {
                res.status(200).json({
                    message: '백신 보유량 저장 성공'
                });
            }
            
            connection.release();
        });
    });
});

/* 특정 병원의 모든 접종 예약 조회 */
router.get('/hospitals/:id/vaccine-reservations', checkAuth_api, function(req, res, next) {    
    pool.getConnection(function(err, connection) {
        if(err) next(err);
        
        let query =
        `
            SELECT r.reservation_date, v.vaccine_name, r.inoculation_number, u.user_name, u.age, (u.Vaccinated_Number >= r.inoculation_number) as is_finished, r.reservation_id
            FROM vaccine_reservation r
                inner join users u
                    on u.User_number = r.user_number
                natural join vaccine v
            WHERE r.hospital_id = ?
            ORDER BY r.reservation_date desc
        `;

        connection.query(query, [req.params.id], function(err, rows) {
            if(err)  {
                next(err);
            }
            else {
                res.json({
                    data: rows // dataTables 호환 format
                });
            }

            connection.release();
        });
    });
});

/* 여러개의 예약건에 대한 접종완료 처리 */
router.post('/hospitals/:id/vaccine-reservations/finish-innoculations', checkAuth_api, function(req, res, next) {    
    pool.getConnection(function(err, connection) {
        if(err) next(err);

        // 병원 관리 비밀번호 일치여부 확인
        connection.query('SELECT * FROM hospitals WHERE hospital_id = ? and admin_password = ?', [req.params.id, req.body.admin_password], function(err, rows) {
            if (err) {
                next(err);
                connection.release();
            }
            else if (!rows.length) {
                res.status(401).json({
                    message: '병원 비밀번호 인증에 실패했습니다!'
                });
                connection.release();
            }
            else {
                let query =
                `
                    UPDATE vaccine_reservation r
                        inner join users u
                            on u.User_number = r.user_number
                    SET u.Vaccinated_Number = u.Vaccinated_Number + 1
                    WHERE r.hospital_id = ? 
                        and r.reservation_id in (${Array(req.body.reservationIds.length).fill('?').join(',')}) 
                        and u.Vaccinated_Number = r.inoculation_number - 1
                `; // 예약차수보다 유저의 접종차수가 1 적은 경우만 유저의 접종차수 1 증가시킴 (1, 2차를 둘다 예약만하고 접종하지 않았는데 2차에 대해 접종완료처리를 하는 경우에 대한 예외처리)

                connection.query(query, [req.params.id, req.body.reservationIds].flat(), function(err, rows) {
                    if(err) {
                        console.log(err);
                        next(err);
                    }
                    else {
                        res.status(200).json({
                            message: '접종완료처리 성공'
                        });
                    }
                    connection.release();
                });
            }
        });
    });
});


module.exports = router; 