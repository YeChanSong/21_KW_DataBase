var express = require('express');
var router = express.Router();
const url = require('url');
var mysql = require('mysql2/promise');
const { connect } = require('.');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'DBproject',
    password: '1234'
});

// Kakao 인증서버 정보
const KakaoRestApiKey = '01b4a1c7c85b88974e0bd12deb284504';
const KakaoClientSecret = 'RDyZZICeXk4VQvYRJmAZWam6KrIvhLKW';
const KakaoRedirectUrl = 'http://localhost:3000/Kakao/Api/Oauth2ClientRedirect';
const KakaoLogoutUrl = 'http://localhost:3000';
let KakaoAuthToken = '';
let KakaoAuthRefreshToken = '';
let KakaoAuthCode = '';
let KakaoState = 'G'; // G
let KakaoResponse = '';
let KakaoLogout;
let KakaoAuthUrl = encodeURI(`https://kauth.kakao.com/oauth/authorize?client_id=${KakaoRestApiKey}&redirect_uri=${KakaoRedirectUrl}&response_type=code&state=G`);
const axios = require('axios');
const qs = require('qs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: '예방접종 사전예약 시스템'});
});

router.get('/landing', function(req, res, next) {
  res.render('landing', {title: '예방접종 사전예약 시스템', kakao: KakaoAuthUrl});
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
let client_id = 'v756K0uuRuF4UkL2YpOo';
let client_secret = 'FWSYT96uK5';
let state = "G";
let redirectURI = encodeURI("http://localhost:3000/Api/Member/Oauth2ClientCallback");
let api_url = "";
let token = "";
let tokenparser;
let disconnect_api_url;
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
        * 
        * --> 12.06 수정사항
        * 네이버/카카오 로그인 종류에 대한 정보를 userdatainput페이지에 넘겨서 로그아웃을 할 때
        * 각 플랫폼에 알맞게 로그아웃 할 수 있도록 지원
        * 
        */

        
        // 접종자 정보를 입력받는 페이지로 연결
        // res.redirect('/userdatainput');
        
        res.redirect('/naveruserinput');
        // res.render('userdatainput', {logoutNaver: disconnect_api_url, logout: dummy, loginType: 'naver'});

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



  //  // 접종자 정보 입력 페이지
   router.get('/naveruserinput', function(req,res){
    console.log("naveruserinput logout url: "+disconnect_api_url); 
    

    res.render('naveruserinput', {logoutNaver: disconnect_api_url});
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
    
    var isFirstVac = async () => {
      var connRes = false;
    //   var isUpdate = 
    //   await pool.getConnection(async function(err,connection){
    //     var sql = "select * from USERS where User_number = ? ";
        
    //     await connection.query(sql, [User_number], function(err, row){
    //       if(err) console.error("error: "+err);
    //       if(row.length>0){
    //         console.log("already exist");
    //         connRes = true;
    //       }
    //       connection.release();
    //   });
    // });

    var sql = "select * from USERS where User_number = ? ";
    var connection = await pool.getConnection(async conn => conn);
    try{
      var [rows] = await connection.query(sql,[User_number]);
      console.log("rows: "+JSON.stringify(rows));
      if(row.length>0){
        console.log("already exist");
        connRes = true;
      }
      connection.release();
    }catch (err){
      console.error("err: "+ err);
      connection.release();
    }
    console.log("in isFirstVac conn: "+connRes);
    return connRes;
  };
  var DBconn = async function(isResult){
    
    if(isResult === false){ // 사용자가 처음 예약을 진행하는 경우
      var datas = [User_number, Sublocation_id, User_name, age, PhoneNum, vaccinated_num];
      console.log("true case data: "+datas);
      
      var sqlForInsertBoard = "insert into USERS(User_number, sublocation_id, User_name, age, Phone_num, Vaccinated_Number) values(?,?,?,?,?,?)";
      var connection = await pool.getConnection(async conn => conn);
      try{
        var [rows] = await connection.query(sqlForInsertBoard,datas);
        console.log("rows: "+JSON.stringify(rows));
        connection.release();
        return true;
      }catch (err){
        console.error("err: "+ err);
        connection.release();
        return false;
      }
      
    }else{
      var datas = [Sublocation_id, User_name, age, PhoneNum, vaccinated_num+1, User_number];
      
        var sqlForInsertBoard = "update USERS set sublocation_id=?, User_name=?, age=?, Phone_num=?, Vaccinated_Number=? where User_number = ?";
        var connection = await pool.getConnection(async conn => conn);
        try{
          var [rows] = await connection.query(sqlForInsertBoard,datas);
          console.log("rows: "+JSON.stringify(rows));
          connection.release();
          return true;
        }catch (err){
          console.error("err: "+ err);
          connection.release();
          return false;
        }
      }
    };
    var result = await isFirstVac();
    await console.log("midd: "+result);
    var dbc = await DBconn(result);
    await console.log(dbc);
    if(dbc){
      res.redirect('/');
    }
  });



// 로그인/로그아웃 테스트 페이지
router.get('/iotest', function(req,res){
  
//  console.log("Kakao url: "+KakaoAuthUrl);
 res.render('in_out_testpage', {login: KakaoAuthUrl, logout: ''});
});

router.get('/kakaologin', function (req, res) {
  res.redirect(KakaoAuthUrl);
 });

router.get('/Kakao/Api/Oauth2ClientRedirect', async function (req, res) {
  KakaoAuthCode = req.query.code;
  console.log("KakaoAuthCode: "+KakaoAuthCode);
  KakaoResponse = await axios({
    method: 'POST',
    url: 'https://kauth.kakao.com/oauth/token',
    headers:{
      'content-type':'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      grant_type: 'authorization_code',
      client_id: KakaoRestApiKey,
      client_secret: KakaoClientSecret,
      redirect_uri: KakaoRedirectUrl,
      code: KakaoAuthCode
    })
  });
  // console.log(KakaoResponse.data);
  KakaoAuthToken = KakaoResponse.data.access_token;
  KakaoAuthRefreshToken = KakaoResponse.data.refresh_token;

  let userDataRes = await axios({
    method: 'GET',
    url: 'https://kapi.kakao.com/v2/user/me',
    headers:{
      Authorization: 'Bearer '+KakaoAuthToken
    }
  });

  // 로그아웃 링크
  KakaoLogout = 'https://kauth.kakao.com/oauth/logout?client_id='+KakaoRestApiKey+'&logout_redirect_uri='+KakaoLogoutUrl;
  // unlink 링크
  // KakaoLogout = {
  //   url: 'https://kapi.kakao.com/v1/user/unlink',
  //   headers:{
  //     Ctype: 'application/x-www-form-urlencoded',
  //     Authorization: 'Bearer '+ KakaoAuthToken
  //   }
  // }

  // res.render('userdatainput', {logout: KakaoLogout, loginType: 'kakao'});
  res.redirect('/kakaouserinput');
});

router.get('/kakaouserinput', function (req, res) {
  console.log("kakaouserinput Logout URL: "+KakaoLogout);
  res.render('kakaouserinput', {logout: KakaoLogout});
  return;
 });

 router.get('/kakaologoutredirect', async function (req, res) {
  
  console.log("\n\nkakaologoutredirect GET\n\n");
  console.log("kakaologoutredirect URL: "+KakaoLogout);
  res.redirect(KakaoLogout);
  // redirect URI를 localhost:3000으로 Kakao Logout Redirect를 설정해서 메인으로 간다.
 });


 var googleClient = require('../config/googleapi.json');
 const {google} = require('googleapis');
 const googleConfig = {
   clientId: googleClient.web.client_id,
   clientSecret: googleClient.web.client_secret,
   redirect: googleClient.web.redirect_uris[0]
 };
 
 const scopes = ['profile'];

const oauth2Client =new google.auth.OAuth2(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.redirect
);


 
function getGooglePlusApi(auth) {
  const service = google.people({version: 'v1', auth});
  service.people.get({
    resourceName: 'people/me',
    personFields: 'names',
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    console.log("getGooglePlusAPI success: "+JSON.stringify(res.data));
    console.log("displayName: "+JSON.stringify(res.data.names));
  });
  
}
 
async function googleLogin(code) {
  const { tokens } = await oauth2Client.getToken(code);
  
  oauth2Client.setCredentials(tokens);
 
  getGooglePlusApi(oauth2Client);
  
  console.log("after token");
}

router.get('/googlelogin',function (req, res) {
  const googleOAuthUrl = oauth2Client.generateAuthUrl({
 
    access_type:'offline',
   
    scope: scopes
  });
  console.log("url: "+googleOAuthUrl);
  res.redirect(googleOAuthUrl);
});
 
router.get("/googleOAuthRedirect", async function (req, res) {
  console.log("code?: "+req.query.code);
  await googleLogin(req.query.code);
  const displayName = req.params.name;
  console.log("displayName: "+displayName);
 
  res.redirect("/");
});



module.exports = router;