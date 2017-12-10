var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
// var Doctor = mongoose.model('Doctor');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var mongoose = require('mongoose');
var fs = require('fs');
var _ = require('underscore');
var sql = require("mssql");;

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
    var config = {
        user: 'svc_oncall',
        password: 'gOGJhG6K1w',
        server: 'xposc-nextgen01', 
        database: 'NGProd'
    };
    sql.connect(config, function (err) {
    
        if (err) console.log('err '+err);
        var request = new sql.Request();
           console.log("connected");
        request.query("select * from viewDrCardCategories where working_date='20091023' union select * from viewDrCardClinicLocations where working_date='20091023' union select * from viewDrCardAppointments where working_date='20091023' order by description, begintime", function (err, recordset) {
            if (err)  {
                console.log(err)
            }
            _.forEach(recordset, function(data) {
            	console.log('done here');
            	doctor = new Docter();
            	doctor.username = data.recordset.description;
            	doctor.Appointment.push({'appointmenTime':data.recordset.working_date,'locationn': data.recordset.Location});

            	doctor.save(function(err, doc ){
            		if (err) {
            			console.log(err)
            		}else {
            			res.send("success");
            		}
            	})
                // var appointment  = [];
                // var appointmenTime = data.working_date + ' ' + data.begintime;
                // appointment.push({'appointmenTime': appointmenTime, 'location': data.Location})
                // db.collection('Docter').insert({username:data.description,Appointment:appointmenTime})
            });

            
        });
    });
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.listen(port);
console.log('Magic happens at http://localhost:' + port);

module.exports = app;
