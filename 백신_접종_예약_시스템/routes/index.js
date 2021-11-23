var express = require('express');
var router = express.Router();
var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: '예방접종 사전예약 시스템'});
});

router.get('/landing', function(req, res, next) {
  res.render('landing', {title: '예방접종 사전예약 시스템'});
});

router.post('/landing', function(req, res, next){
  console.log("landing post");
  console.log('req.body: ' + JSON.stringify(req.body));
});


/* 네이버 로그인 */
var client_id = 'v756K0uuRuF4UkL2YpOo';
var client_secret = 'FWSYT96uK5';
var state = "G";
var redirectURI = encodeURI("http://localhost:3000/Api/Member/Oauth2ClientCallback");
var api_url = "";
var token = "";
var tokenparser;
router.get('/naverlogin', function (req, res) {
  api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
   res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
   res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
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
        console.log(token);
        
        res.redirect('/member');
      } else {
        res.status(response.statusCode).end();
        console.log('error = ' + response.statusCode);
      }
    });
  });
  
  // app.listen(3000, function () {
  //   console.log('http://127.0.0.1:3000/naverlogin app listening on port 3000!');
  // });


  /* 회원 프로필 조회 */
  // 고유ID, 생년월일, 이름, 전화번호를 가져온다
  // 생년월일 --> 나이 계산 // 주민등록번호 대신 고유ID를 활용.. --> 고유ID의 길이가 20을 넘으므로 USERS 테이블 수정해야 할 수 있다.
  router.get('/member', function (req, res) {
    var header = "Bearer " + token; // Bearer 다음에 공백 추가
    console.log(header);
    console.log(token);
     var api_url = 'https://openapi.naver.com/v1/nid/me';
     var request = require('request');
     var options = {
         url: api_url,
         headers: {'Authorization': header}
      };
      
     request.get(options, function (error, response, body) {
       
       if (!error && response.statusCode == 200) {
         res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
         res.end(body);
       } else {
         console.log('error');
         if(response != null) {
           res.status(response.statusCode).end();
           console.log('error = ' + response.statusCode);
         }
       }
     });
   });
  //  app.listen(3000, function () {
  //    console.log('http://127.0.0.1:3000/member app listening on port 3000!');
  //  });
  

module.exports = router;