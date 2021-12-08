var express = require('express');
var router = express.Router();
const passport = require('passport');
var pool = require('./db')

//접종 가능 병원 조회 API
/*
* DB에 저장된 모든 병원의 이름과 주소 조회
* */
router.get('/', function(req, res, next){
    const query = `SELECT * FROM HOSPITALS`;
    pool.getConnection((err, connection) => {
       if(err){
           console.log('Error: ' + err);
       }
       connection.query(query, (err, rows) => {
          connection.release();
          res.render('reservation/list', {rows: rows});
       });
    });
});

/*
* 병원 form 뿌려주는 API
* */
router.get('/:hid', (req, res, next) => {
    res.locals.stuff={
        hid: req.params.hid
    }
    res.render('reservation/request');
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
router.post('/', function(req, res, next){
    console.log(req.body);
    const query =
        `
        INSERT INTO VACCINE_RESERVATION 
        (hospital_id, reservation_date, vaccine_id, inoculation_number, user_number) 
        VALUES(?, ?, ?, ?, ?)
        `;
    pool.getConnection((err, connection)=>{
        const b = req.body;
        const params = [b.hospital_id, b.reservation_date, b.vaccine_id, b.inoculation_number, b.id];
       connection.query(query, params, (err, rows) => {
           if(err){
               console.log('[ERR] post /' + err);
           }
           connection.release();
           res.redirect('/reservation');
       }) ;
    });
});

//예약 취소 API
router.delete('/:rid', function(req, res, next){
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