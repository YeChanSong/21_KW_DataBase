var express = require('express');
var router = express.Router();
const passport = require('passport');
var mysql = require('mysql');
var pool = require('./db');

router.get('/', (req, res, err) => {
   res.render('reservation/uid_input');
});

//예약 확인
/*
* RESULT
* hospital_name: 병원 이름
* reservation_date: 예약 일자
* reservation_id: 예약 PK
* NOTE: 전송 정보를 감추기 위해 POST방식으로 전송
* */
router.post('/', (req, res, err) => {
   const b = req.body;
   const query =
       `SELECT v.reservation_id, v.reservation_date, v.inoculation_number, c.comment_id, h.hospital_name, u.Vaccinated_Number, u.User_number
        FROM VACCINE_RESERVATION as v 
            JOIN HOSPITALS as h 
            JOIN USERS as u 
               on v.user_number = u.User_number
            LEFT OUTER JOIN VACCINE_COMMENT as c 
               on v.reservation_id = c.reservation_id 
         WHERE v.User_number = ? AND h.hospital_id = v.hospital_id
        `;
   pool.getConnection((err, connection) => {
      connection.query(query, [b.user_number], (err, rows) => {
         if(err){
            console.log("[ERR] post /mypage " + err);
         }
         else{
            var arr = Object.values(JSON.parse(JSON.stringify(rows)));
            console.log(arr);
            for(var i = 0; i < arr.length; i++){
               arr[i].reservation_date = arr[i].reservation_date.substr(0, 10);
            }
         }
         connection.release();
         res.render('reservation/mypage', {rows: arr, data_length: arr == undefined ? 0 : arr.length});
      });
   });
});

module.exports = router;