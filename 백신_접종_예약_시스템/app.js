var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var prjRouter = require('./routes/board');
var reviewsRouter = require('./routes/reviews');
var adminRouter = require('./routes/admin');
var reservationRouter = require('./routes/reserve');
var mypageRouter = require('./routes/mypage');

const admin_account = { id: 'admin', pw: '1234', isAdmin: true } // 관리자 페이지 계정 정보

// admin 로그인 페이지에만 사용
passport.use('local-admin', new LocalStrategy(
  function(username, password, done) {
    if (username === admin_account.id && password === admin_account.pw) {
      return done(null, admin_account);
    }
    else {
      return done(null, false);
    }
  }  
));

// session에 user정보의 일부중 어떤걸 저장할지 정의
passport.serializeUser(function (user, done) {
  done(null, {
    "id": user.id,
    "isAdmin": user.isAdmin
  });
});

// session에 저장된 user의 일부 정보를 이용해서 어떻게 user정보를 반환할지 정의
passport.deserializeUser(function (user, done) {
  if (user.isAdmin) {
    done(null, admin_account);
  }
  else { // 접종자 계정
    done(null, null);
  }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
  secret: 'test string',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', prjRouter);
app.use('/reviews', reviewsRouter);
app.use('/admin', adminRouter);
app.use('/reservation', reservationRouter);
app.use('/mypage', mypageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
