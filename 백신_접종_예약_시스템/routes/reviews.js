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
            ${req.query.length != -1 && 'LIMIT ' + Number(req.query.length) + ' OFFSET ' + Number(req.query.start)}
        `;

        connection.query(query, function(err, rows) {
            if(err) console.error("err: "+err);
            let commentRows = rows

            connection.query('SELECT FOUND_ROWS()', function(err, rows) { // 전체 comment 개수 쿼리
                if(err) console.error("err: "+err);

                // https://datatables.net/manual/server-side
                res.json({
                    draw: Number(req.query.draw),
                    recordsTotal: rows[0]['FOUND_ROWS()'],
                    recordsFiltered: rows[0]['FOUND_ROWS()'],
                    data: commentRows
                });
                connection.release();
            });
        });
    });
});

module.exports = router; 