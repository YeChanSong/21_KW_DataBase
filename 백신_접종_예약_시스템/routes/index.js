var express = require('express');
var router = express.Router();

var mysql = require('mysql');
const { connect } = require('.');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'DBproject',
    password: '1234'
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: '예방접종 사전예약 시스템'});
});

router.get('/landing', function(req, res, next) {
  res.render('landing', {title: '예방접종 사전예약 시스템'});
});

// router.post('/landing', function(req, res, next){
//   console.log("landing post");
//   console.log('req.body: ' + JSON.stringify(req.body));
// });


// // for logging
// var fs = require('fs');
// var util = require('util');
// var logfileName = '/home/david/Desktop/log.txt';
// var logfile = fs.createWriteStream(logfileName, {flags : 'a+'});
// var log_stdout = process.stdout;

// console.log = function(d) {
//     logfile.write(util.format(d) + '\n\n\n');
//     log_stdout.write(util.format(d) + '\n\n\n');
// };


/* 네이버 로그인 */
var client_id = 'v756K0uuRuF4UkL2YpOo';
var client_secret = 'FWSYT96uK5';
var state = "G";
var redirectURI = encodeURI("http://localhost:3000/Api/Member/Oauth2ClientCallback");
var api_url = "";
var token = "";
var tokenparser;
var disconnect_api_url;
router.post('/naverlogin', function(req,res,next){
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
  res.redirect(api_url);
});

router.get('/naverlogin', function (req, res) {
  // api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
  //  res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
  //  res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
  res.render('naverlogin', {title: '예방접종 사전예약 시스템'});
 });

router.get('/Api/Member/Oauth2ClientCallback', function (req, res) {
    code = req.query.code;
    state = req.query.state;
    api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + client_id + '&client_secret=' + client_secret + '&redirect_uri=' + redirectURI + '&code=' + code + '&state=' + state;
    var request = require('request');
    var options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
     };
     
    request.get(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
        // res.end(body);
        tokenparser = JSON.parse(body);
        token = tokenparser.access_token;
        console.log("login access_token: "+token);
        console.log("timeout: "+tokenparser.expires_in);
        res.redirect('/member');
      } else {
        res.redirect('/autherror');
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
  });
  
  /* 회원 프로필 조회 */
  // 고유ID, 생년월일, 이름, 전화번호를 가져온다
  // 생년월일 --> 나이 계산 // 주민등록번호 대신 고유ID를 활용.. --> 고유ID의 길이가 20지을 넘으므로 USERS 테이블 수정해야 할 수 있다.
  router.get('/member', function (req, res) {
    var header = "Bearer " + token; // Bearer 다음에 공백 추가
    console.log("login access_token: "+token);
     var api_url = 'https://openapi.naver.com/v1/nid/me';
     var request = require('request');
     var options = {
         url: api_url,
         headers: {'Authorization': header}
      };
      
     request.get(options, function (error, response, body) {
       
       if (!error && response.statusCode == 200) {
        //  res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'}지);
        //  res.end(body);

        // 로그아웃 테스트코드
        disconnect_api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id='+client_id+'&client_secret='+client_secret+'&access_token='+token+'&service_provider=NAVER';
        console.log("logout url: "+disconnect_api_url); 
        // res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        // res.end("<a href='"+ disconnect_api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
        
        var parsedData = JSON.parse(body.split(","));
        
        console.log(parsedData.response);

        /*
        * parseData.response에 사용자의 정보가 담겨있다.
        * 이 정보를 DB에 저장하는 부분만 진행하면 되는데
        * 문제는 사용자의 주민등록번호 정보가 없기 때문에 DB 테이블을 수정해야 할 것 같다.
        * 
        * --> 11.25 수정사항
        * 처음 landing페이지 SNS인증 => 예약자 인증
        * 이후 페이지를 추가하여 접종자 정보를 입력받아 인증을 진행
        * 접종자 정보를 USERS 테이블에 저장
        * 예약자 정보는 이름, 이메일, 연령대, 성별만 제공받는다.
        */

        
        // 접종자 정보를 입력받는 페이지로 연결
        res.redirect('/userdatainput');


       } else {
        res.redirect('/autherror');
         console.log('error');
         if(response != null) {
           res.status(response.statusCode).end();
           console.log('error = ' + response.statusCode);
         }
       }
     });
   });
  
  // 인증 도중 취소 및 기타 에러 처리 페이지
   router.get('/autherror', function(req,res){

    res.render('autherror');
   });

   // 로그인/로그아웃 테스트 페이지
   router.get('/iotest', function(req,res){
    console.log("logout url: "+disconnect_api_url); 

    res.render('in_out_testpage', {login: api_url, logout: disconnect_api_url});
   });

   // 접종자 정보 입력 페이지
   router.get('/userdatainput', function(req,res){
    console.log("logout url: "+disconnect_api_url); 

    res.render('userdatainput', {logout: disconnect_api_url});
   });

   

  // 접종자 정보를 입력받아 DB에 저장
  router.post('/userdatainput', async function(req, res, next){
    console.log("userdatainput post\n\n");
    console.log('req.body: ' + JSON.stringify(req.body));

    var User_number = req.body.ptntRrn1+"-"+req.body.ptntRrn2;
    var Sublocation_id = 1;
    var User_name = req.body.patnam;
    var vaccinated_num=0;
    var today = new Date();
    var birth;
    if(req.body.ptntRrn1[0]>2){
      birth = 1900+Number(req.body.ptntRrn1[0])*10+Number(req.body.ptntRrn1[1]);
    }else{
      birth = 2000+Number(req.body.ptntRrn1[0])*10+Number(req.body.ptntRrn1[1]);
    }
    var age = Number.parseInt(today.getFullYear()) - Number(birth);
    var PhoneNum = req.body.apnmMtnoTofmn+"-"+req.body.apnmMtno1+"-"+req.body.apnmMtno2;
    var isResult = await function poolcon(){
    pool.getConnection(function(err,connection){
        var sql = "select * from USERS where User_number = ? ";
        connection.query(sql, [User_number], function(err, row){
          if(err) console.error("error: "+err);
          if(row.length>0){
            console.log("already exist");
            isResult = true;
            console.log("isResult: "+isResult);
            vaccinated_num=row[0].Vaccinated_Number+1;
          }
          connection.release();
      });
    });
  };

    if(isResult === false){ // 사용자가 처음 예약을 진행하는 경우
      var datas = [User_number, Sublocation_id, User_name, age, PhoneNum, vaccinated_num];
      pool.getConnection(function(err, connection){
          var sqlForInsertBoard = "insert into USERS(User_number, sublocation_id, User_name, age, Phone_num, Vaccinated_Number) values(?,?,?,?,?,?)";
          connection.query(sqlForInsertBoard, datas, function(err, rows){
              console.log("insert here");
              if(err) console.error("err: "+ err);
              console.log("rows : " + JSON.stringify(rows));


              // 병원 예약 페이지로 연결하면 됨
              res.redirect('/');
              connection.release();
          });
      });
    }else{
      var datas = [Sublocation_id, User_name, age, PhoneNum, vaccinated_num, User_number];
      pool.getConnection(function(err, connection){
          var sqlForInsertBoard = "update USERS set sublocation_id=?, User_name=?, age=?, Phone_num=?, Vaccinated_Number=? where User_number = ?";
          connection.query(sqlForInsertBoard, datas, function(err, rows){
            console.log("update here");
              if(err) console.error("err: "+ err);
              console.log("rows : " + JSON.stringify(rows));


              // 병원 예약 페이지로 연결하면 됨
              res.redirect('/');
              connection.release();
          });
      });
    }
    
  });

module.exports = router;