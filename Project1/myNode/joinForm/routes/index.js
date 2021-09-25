var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tutorial'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  pool.getConnection(function(err, connection){
    // use connection
    connection.query('select * from board', function(err, rows){
      if(err) console.error("err: "+err);
      console.log("rows : " + JSON.stringify(rows));
      res.render('index', {title: 'test', rows: rows});
      connection.release();
    });
  });
});

module.exports = router;
