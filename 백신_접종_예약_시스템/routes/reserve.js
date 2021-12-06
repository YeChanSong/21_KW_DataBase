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
//백신 접종 완료 api
/*
*   hospital_id: 병원 id
*   vaccinated_number: 접종 차수
*   user_id: 유저의 id
*  */
router.post('/reservation/user/:userId', function(req, res, next){
   //유저의 접종 차수 + 1
    pool.getConnection(function(err, connection){
       let query =
           `
                UPDATE users
                SET Vaccinated_Number = ?
                WHERE User_number = ?
           `;
       connection.query(query, [req.body.vaccinated_number + 1, req.params.userId], function(err, rows){
           connection.release();
       });
   });
    //예약 내역 지우기
    pool.getConnection(function(err, connection){
        let query =
            `
                DELETE FROM vaccine_reservation
                WHERE user_number = ?
           `;
        connection.query(query, [req.params.userId], function(err, rows){
            connection.release();
        });
    });
});
//병원에 예약된 내역
router.get('/reservation/hospital/:id', function(req, res, next){
   pool.getConnection(function (err, connection){
       let query =
           `
                SELECT * FROM vaccine_reservation v 
                JOIN hospitals h ON h.hospital_id = ?
                JOIN users u ON u.User_number = v.user_number
           `;
       connection.query(query, [req.params.id], function(err, rows){
          if(err) next(err);
          else{
              res.json(rows);
          }
          connection.release();
       });
   });
});

//유저의 예약 내역
router.get('/reservation/user/:id', function(req, res, next){
    pool.getConnection(function (err, connection){
        let query =
            `
                SELECT * FROM vaccine_reservation v 
                JOIN users u ON u.User_number = ?
                JOIN hospital h ON h.hospital_id = u.hospital_id
            `;
        connection.query(query, [req.params.id], function(err, rows){
            if(err) next(err);

            else{
                res.render('/reservation/read_reservation', {rows});
            }
            connection.release();
        });
    });
});

//예약 API
router.post('/reservation', function(req, res, next){
   pool.getConnection(function(err, connection){
       let query =
           `
           INSERT INTO vaccine_reservation(reservation_date, inoculation_number, hospital_id, user_number, vaccine_id)
           VALUES(NOW(), ?, ?, ?, ?)
           `;
       const b = req.body;
       //기존 차수에 1을 더하여 적용
       connection.query(query, [b.inoculation_number, b.hospital_id, b.user_number, b.vaccine_id],
           function(err, rows){
           console.log(req.body);
           if(err) next(err);

           else{
                res.redirect('/reservation/user/' + req.params.id);
           }
           connection.release();
       });
   });
});

module.exports = router;