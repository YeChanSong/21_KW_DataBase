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

let InjectPolicy = function(){
    pool.getConnection((err, connection) => {
       let query = `SELECT COUNT(*) vaccine_reservation WHERE reservation_date = ?`;
       connection.query(query, (err, rows) => {
           connection.release();
           return rows[0] <= 10;
       });
    });
};
//백신 접종 완료 api
/*
*   hospital_id: 병원 id
*   vaccinated_number: 접종 차수
*   user_id: 유저의 id
*  */
router.post('/reservation/user/:uid', function(req, res, next){
   //유저의 접종 차수 + 1
    pool.getConnection(function(err, connection){
       let query =
           `
                UPDATE users
                SET Vaccinated_Number = ?
                WHERE User_number = ?
           `;
       connection.query(query, [req.body.vaccinated_number + 1, req.params.uid], function(err, rows){
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
        connection.query(query, [req.params.uid], function(err, rows){
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
router.get('/reservation/user/:uid', function(req, res, next){
    pool.getConnection(function (err, connection){
        let query =
            `
                SELECT * FROM vaccine_reservation v 
                JOIN users u ON u.User_number = ?
                JOIN hospital h ON h.hospital_id = u.hospital_id
            `;
        connection.query(query, [req.params.uid], function(err, rows){
            if(err) next(err);

            else{
                res.render('/reservation/read_reservation', {rows});
            }
            connection.release();
        });
    });
});

//예약 API
/*
* hospital_id: 병원 ID
* reservation_date: 예약 날짜 (yyyy:mm:dd)
* vaccine_id: 백신 ID
* inoculation_number: 접종 차수
* user_number: 유저 식별 번호
* NOTE: 10개를 초과하는 예약은 불가능하게 동작
* */
router.post('/reservation', function(req, res, next){
   if(!InjectPolicy()){
       res.render('/reservation', {'message': '예약 개수가 초과되어 더 이상 예약할 수 없는 병원입니다.'});
       return;
   }
    const b = req.body;
    pool.getConnection((err, connection) => {
      let query =
      `
        INSERT INTO vaccine_reservation (hospital_id, reservation_date, vaccine_id, inoculation_number, user_number)
        VALUES(?, ?, ?, ?, ?)
      `;
      connection.query(query, [b.hospital_id, b.reservation_date, b.vaccine_id, b.inoculation_number, b.user_number],
          (err, rows) => {
            if(err) next(err);
            else{
                //등록 후에는 리다이렉트
                res.redirect('/reservation');
            }
          });
   });
});

//예약 취소 API
router.delete('/reservation/:rid', function(req, res, next){
    pool.getConnection(function(err, connection){
       let query =
        `
            DELETE FROM vaccine_reservation
            WHERE id = ?
        `;
       connection.query(query, [req.params.rid], function(err, rows){
            if(err) next(err);
            else{
                res.redirect('/reservation/')
            }
       });
       connection.release();
    });
});

module.exports = router;