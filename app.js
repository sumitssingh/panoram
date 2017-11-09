var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');

var port = process.env.PORT || 3000;

var configDB = require('./config/database.js');
mongoose.connect(configDB.url,{ useMongoClient: true });

require('./models/doctorEntity');
// require('./models/hospitalEntity');
require('./authMiddleWare');
require('./config/passport');

var auth = require('./routes/auth');
var users = require('./routes/users');
var admin = require('./routes/admin/auth');
var doctor = require('./routes/admin/doctor');
var app = express();

// view engine setup
app.set('superSecret', 'secret');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(cors({
    origin: '*',
    withCredentials: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin' ]
}));

// app.options('/auth/profile/upload', cors())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/auth', auth);
app.use('/doctor', users);
app.use('/admin', admin);
app.use('/admin/doctor', doctor);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.listen(port);
console.log('Magic happens at http://localhost:' + port);

module.exports = app;
