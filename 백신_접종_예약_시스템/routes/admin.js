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

router.get('/hospital-management', function(req, res, next) {
    res.render('admin/hospital_management', {title: '예방접종 사전예약 시스템'});
});

/* 모든 구, 동 목록 조회 */
router.get('/hospital-management/location-data', function(req, res, next) {
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
            if(err) console.error("err: "+err);

            let location_data = {};
            for (const row of rows) {
                if (location_data[row['location_name']] === undefined) {
                    location_data[row['location_name']] = [];
                }
                location_data[row['location_name']].push(row['sublocation_name']);
            }

            res.json(location_data);
            connection.release();
        });
    });
});

/* 병원 목록 dataTables 에 대한 server side processing */
router.get('/hospital-management/hospitals-data-tables-source', function(req, res, next) {
    pool.getConnection(function(err, connection) {
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
                h.hospital_name, h.hospital_location, l.location_name, sl.sublocation_name
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
            if(err) console.error("err: "+err);
            let hospitalRows = rows

            connection.query('SELECT FOUND_ROWS()', function(err, rows) {
                if(err) console.error("err: "+err);

                res.json({
                    draw: Number(req.query.draw),
                    recordsTotal: rows[0]['FOUND_ROWS()'],
                    recordsFiltered: rows[0]['FOUND_ROWS()'],
                    data: hospitalRows
                });
                connection.release();
            });
        });
    });
});

module.exports = router; 