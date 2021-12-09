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
    res.redirect('/admin/hospitals/individual-management');
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

/* 병원 1곳 단위의 백신 수량 관리 페이지 */
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
            SELECT r.reservation_date, v.vaccine_name, r.inoculation_number, u.user_name, u.age
            FROM vaccine_reservation r
                inner join users u
                    on u.User_number = r.user_number
                natural join vaccine v
            WHERE r.hospital_id = ?
            ORDER BY r.reservation_date asc
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



module.exports = router; 