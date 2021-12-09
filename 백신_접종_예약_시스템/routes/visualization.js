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
  pool.getConnection(function(err,connection){    
        
    var sql_date = "SELECT * FROM dbproject.vaccine_date;";
    var sql_age = "SELECT * FROM dbproject.vaccine_age;";

    connection.query(sql_date,function(err,rows){
          if(err) console.error("err : " + err);

          console.log("row: " + JSON.stringify(rows));
          
          
          connection.query(sql_age,function(err,rows2){
            if(err) console.error("err : " + err);
  
            console.log("row2: " + JSON.stringify(rows2));
                      
            res.render('visualization',{title : '시각화 페이지',rows: rows,rows2: rows2});
            connection.release();
            
  
          })


        })
      })
});


router.get('/map', function(req, res, next) {
  var target = req.query.target;
  var meter = req.query.meter;
  var datas = [target,meter];
  var lng_lat = target.split(' ');
  pool.getConnection(function(err,connection){    
    var sql = "SELECT hospital_id, hospital_name,  ST_X(hospital_point) as x, ST_Y(hospital_point)as y FROM hospitals WHERE ST_Distance_Sphere(hospital_point, ST_GeomFromText('POINT(" + target + ")')) <= "+ meter+";";
    connection.query(sql,function(err,rows){
      console.log(sql);      
      if(err) console.error("err : " + err);
      console.log("row: " + JSON.stringify(rows));
      
  res.render('map',{title : '근처 병원',rows:rows,lng_lat:lng_lat});
  connection.release();

    });
  });

});



  module.exports = router;