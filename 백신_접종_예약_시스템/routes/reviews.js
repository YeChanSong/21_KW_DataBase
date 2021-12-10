var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'dbproject'
});

/* 전체 접종 후기 조회 화면 */
router.get('/', function(req, res, next) {
    res.render('reviews', {title: '예방접종 사전예약 시스템'});
});

/* 접종 후기 목록 dataTables 에 대한 server side processing */
router.get('/data-tables-source', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        // case ~ end: 이름 마스킹 (https://linked2ev.github.io/database/2019/05/11/DEV-SQL-1.-sql-masking-name-id/)
        let query = 
        `
            SELECT SQL_CALC_FOUND_ROWS 
            (
                CASE WHEN CHAR_LENGTH(u.User_name) > 2 THEN
                    CONCAT(
                        SUBSTRING(u.User_name, 1, 1)
                        ,LPAD('*', CHAR_LENGTH(u.User_name) - 2, '*')
                        ,SUBSTRING(u.User_name, CHAR_LENGTH(u.User_name), CHAR_LENGTH(u.User_name))
                    )
                    ELSE CONCAT(
                        SUBSTRING(u.User_name, 1, 1)
                        ,LPAD('*', CHAR_LENGTH(u.User_name) - 1, '*')
                    )
                END
            ) as user_name, vc.content, v.vaccine_name, vc.vaccine_rating, h.hospital_name, vc.hospital_rating
            FROM vaccine_comment vc 
                natural join users u
                natural join vaccine v
                natural join hospitals h
            ORDER BY vc.comment_id desc 
            ${req.query.length != -1 && 'LIMIT ' + connection.escape(Number(req.query.length)) + ' OFFSET ' + connection.escape(Number(req.query.start))}
        `;

        connection.query(query, function(err, rows) {
            if(err) {
                next(err);
                connection.release();
            }
            else {
                let commentRows = rows

                connection.query('SELECT FOUND_ROWS()', function(err, rows) { // 전체 comment 개수 쿼리
                    if(err) {
                        next(err);
                    }
                    else {
                        // https://datatables.net/manual/server-side
                        res.json({
                            draw: Number(req.query.draw),
                            recordsTotal: rows[0]['FOUND_ROWS()'],
                            recordsFiltered: rows[0]['FOUND_ROWS()'],
                            data: commentRows
                        });
                        connection.release();
                    }
                });
            }
        });
    });
});


router.get('/write', function(req, res, next) {
    res.redirect('/reviews');
});

var checkWriteAuth = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM vaccine_reservation WHERE reservation_id = ? AND user_number = ? ', [req.body.reservation_id, req.body.user_number], function(err, rows) {
            if(err || !rows.length)  {
                console.log('hello')
                res.redirect('/reviews');
            } else {
                console.log(rows);
                next();
            }
            connection.release();
        });
    });
}

/* 접종 후기 작성 화면 또는 후기 작성*/
router.post('/write', checkWriteAuth, function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err) next(err);

        if (req.body.review_content && req.body.vaccine_rating && req.body.hospital_rating) {
            let query =
            `
                INSERT INTO vaccine_comment(content, vaccine_id, User_number, hospital_id, vaccine_rating, hospital_rating, reservation_id)
                SELECT ?, vaccine_id, user_number, hospital_id, ?, ?, reservation_id
                FROM vaccine_reservation
                WHERE reservation_id = ?
            `;

            connection.query(query, [req.body.review_content, req.body.vaccine_rating, req.body.hospital_rating, req.body.reservation_id], function(err, rows) {
                if (err) {
                    next(err);
                }
                else {
                    res.redirect('/reviews');
                }
                
                connection.release();
            });
        }
        else {
            let query =
            `
                SELECT v.vaccine_name, h.hospital_name, r.inoculation_number
                FROM vaccine_reservation r
                    natural join vaccine v
                    natural join hospitals h
                WHERE r.reservation_id = ?
            `;

            connection.query(query, [req.body.reservation_id], function(err, rows) {
                if(err)  {
                    next(err);
                }
                else {
                    res.render('write_review', {title: '예방접종 사전예약 시스템', data: rows[0], reservation_id: req.body.reservation_id, user_number: req.body.user_number})
                }

                connection.release();
            });
        }
    });
});


var checkModifyAuth = function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM vaccine_reservation r natural join vaccine_comment c WHERE r.user_number = ? AND c.comment_id = ? ', [req.body.user_number, req.params.id], function(err, rows) {
            if(err || !rows.length)  {
                res.redirect('/reviews');
            } else {
                next();
            }
            connection.release();
        });
    });
}

/* 자신이 작성한 단일 접종 후기 조회 화면 */
router.post('/:id', checkModifyAuth, function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if(err) next(err);
        
        let query =
        `
            SELECT vc.content, v.vaccine_name, vc.vaccine_rating, h.hospital_name, vc.hospital_rating
            FROM vaccine_comment vc 
                natural join vaccine v
                natural join hospitals h
            WHERE vc.comment_id = ?
        `;

        connection.query(query, [req.params.id], function(err, rows) {
            if(err)  {
                next(err);
            }
            else {
                res.render('read_review', {title: '예방접종 사전예약 시스템', data: rows[0], comment_id: req.params.id, user_number: req.body.user_number})
            }

            connection.release();
        });
    });
});

/* 자신이 작성한 단일 접종 후기 수정 */
router.put('/:id', checkModifyAuth, function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err) next(err);

        let query =
        `
            UPDATE vaccine_comment
            SET content = ?, vaccine_rating = ?, hospital_rating = ?
            WHERE comment_id = ?
        `;

        connection.query(query, [req.body.review_content, req.body.vaccine_rating, req.body.hospital_rating, req.params.id], function(err, rows) {
            if (err) {
                next(err);
            }
            else {
                res.redirect('/reviews'); 
            }
            
            connection.release();
        });
    });
});

/* 자신이 작성한 단일 접종 후기 삭제 */
router.delete('/:id', checkModifyAuth, function(req, res, next) {
    pool.getConnection(function(err, connection) {
        if (err) next(err);

        let query =
        `
            DELETE FROM vaccine_comment
            WHERE comment_id = ?
        `;

        connection.query(query, [req.params.id], function(err, rows) {
            if (err) {
                next(err);
            }
            else {
                res.redirect('/reviews'); 
            }
            
            connection.release();
        });
    });
});

module.exports = router; 