var express = require('express');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');

var storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'public/images');
    },
    filename(req,file,cb){
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

var upload = multer({storage: storage});

var mysql = require('mysql');
const { connect } = require('.');
var pool = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    database: 'DBproject',
    password: '1234'
});

router.get('/join', function(req, res, next){
    res.render('joinform', {title: 'Join Form!'});
});

router.post('/join', function(req,res,next){
    console.log('req.body: ' + JSON.stringify(req.body));
    res.json(req.body);
});

router.get('/',function(req,res,next){
    res.redirect('/board/list/1');
});

router.get('/list/:page', function(req,res,next){
    pool.getConnection(function(err,connection){
        var sqlForSelectList = "select idx, creator_id, title, hit from Project1";
        connection.query(sqlForSelectList, function(err, rows){
            if(err) console.error("err : "+err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('list', {title: '게시판 전체 글 조회', rows: rows});
            connection.release();
        });
    });
});

router.get('/write', function(req,res,next){
    res.render('write', {title: "게시판 글 쓰기"});
});

router.post('/write', upload.single('img'), function(req,res,next){
    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var file = req.file.filename;
    console.log(file);
    var datas = [creator_id, title, content, file, passwd];

    pool.getConnection(function(err, connection){
        var sqlForInsertBoard = "insert into Project1(creator_id, title, content, image, passwd) values(?,?,?,?,?)";
        connection.query(sqlForInsertBoard, datas, function(err, rows){
            if(err) console.error("err: "+ err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/board');
            connection.release();
        });
    });
});

router.get('/read/:idx', function(req,res,next){
    var idx = req.params.idx;
    pool.getConnection(function(err, connection){
        var sql = "select idx, creator_id, title, content, image, hit from Project1 where idx = ?";
        connection.query(sql, [idx], function(err, row){
            if(err) console.error(err);
            console.log("1개 글 조회 결과 확인 : ", row);
            console.log("img: ",row[0].image);
            res.render('read', {title: "글 조회", row:row[0]});
            connection.release();
        });
    });
});

router.get('/update',function(req,res,next){
    var idx = req.query.idx;
    pool.getConnection(function(err, connection){
        if (err) console.error("커넥션 객체 얻어오기 에러 : ",err);
        var sql = "select idx, creator_id, title, content, hit from Project1 where idx=?";
        connection.query(sql,[idx],function(err, rows){
            if(err) console.error(err);
            console.log("update에서 1개 글 조회 결과 확인 : ", rows);
            res.render('update', {title: "글 수정", row: rows[0]});
            connection.release();
        });
    });
});

router.post('/update', function(req,res,next){
    var idx = req.body.idx;
    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [creator_id, title, content, idx, passwd];

    pool.getConnection(function(err, connection){
        var sql = "update Project1 set creator_id=?, title=?, content=? where idx=? and passwd=?";
        connection.query(sql, [creator_id, title, content, idx,passwd], function(err,result){
            console.log(result);
            if(err) console.error("글 수정 중 에러 발생 err: ", err);

            if(result.affectedRows==0){
                res.send("<script> alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 변경되지 않았습니다.'); history.back();</script>");
            }else{
                res.redirect('/prj1/read/'+idx);
            }
            connection.release();
        });
    });
});


module.exports = router;