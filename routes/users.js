var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
var upload = multer({dest: 'upload/'})
var Doctor = mongoose.model('Doctor');
var Hospital = mongoose.model('Hospital');
var ensureAuthenticated = require('../authMiddleWare');


/* GET users listing. */
router.get('/fetchAllDoctor', function (req, res) {
    Doctor.find({}, function (err, doc) {
    if (err)
        res.send({status: false, info: "Something is not right"})
    res.send({status: true, doctor:doc});
    })
})
router.get('/fetch/All/location', function (req, res) {
    Doctor.find({}, function (err, doc) {
    if (err) {
        res.send({status: false, info: "Something is not right"})
    } else{
var docLocation =[];
       for (var i = doc.length - 1; i >= 0; i--) {
           var location = doc[i].Appointment.map(function(loc){
            docLocation.push(loc.location);
            return docLocation;
           })
           
       }
        res.send(docLocation);
    }
    })
})
router.use(ensureAuthenticated);
router.get('/myProfile', function(req, res, next) {
  Doctor.findById(req.userId, function (err, doctor) {
      if (err) {
          res.send(err)
      } else {
          res.contentType(doctor.doctorDp.contentType);
          // res.send(doctor);
          res.send(doctor.doctorDp.data);
      }
  })
});

router.post('/upload/dp', upload.any(), function (req, res) {
    Doctor.findById(req.userId, function (err, doctor) {
        if (err)
            res.send(err)
        console.log(req.files);
        doctor.doctorDp.data = fs.readFileSync(req.files[0].path);
        doctor.doctorDp.contentType = req.files[0].mimetype;
        doctor.save(function (err, a) {
            if (err)
                res.send(err);
            res.send(req.files);
            // res.send(doctor)
        })
    })
});
router.route('/follow/me')
    .get(function(req, res){
        Doctor.findById(req.userId, function(err, user){
            if(err)
                res.send(err);

            var myMatch = user.following.map(function(ele) {
                return ele;
            });
            Doctor.find({
                _id: {
                    $in: myMatch
                }
            },function(err, docs) {
                res.send(docs)
            });
        });
    })
router.route('/following')
    .get(function(req, res){
        Doctor.findById(req.userId, function(err, user){
            if(err)
                res.send(err);

            var myMatch = user.follow.map(function(ele) {
                return ele;
            });
            Doctor.find({
                _id: {
                    $in: myMatch
                }
            },function(err, docs) {
                res.send(docs)
            });
        });
    })
router.post('/create/appointment', function (req, res) {
    Doctor.findById(req.userId, function (err, doc) {
        if (err)
            res.send({status: false, info:err});
        console.log(doc.Appointment.length);
        if (doc.Appointment.length>=1) {
            for (var i = doc.Appointment.length; i > 0; i--) {
                console.log(i);
                doc.Appointment.push({"patient": req.body.patientName, "location": req.body.location})
                doc.Appointment[i].for.push({
                    "disease": req.body.dieses, "appointmentTime": req.body.appointmentTime,
                    "status": req.body.status
                })
                // doc.Appointment[0].location= req.body.location;

                doc.save(function (err, data) {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send({status: true, info: "Appointment saved"});
                    }
                })
            }
        } else {
            doc.Appointment.push({"patient": req.body.patientName, "location": req.body.location})
            doc.Appointment[0].for.push({
                "disease": req.body.dieses, "appointmentTime": req.body.appointmentTime,
                "status": req.body.status
            })
            doc.save(function (err, data) {
                if (err) {
                    res.send(err)
                } else {
                    res.send({status: true, info: "Appointment saved"});
                }
            })
        }
})
})
router.post('/getAppointmentByDoctor', function (req, res) {
        Doctor.findById(req.body.id, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            }else {
                var myAppointment = [];
                if (doc.Appointment.length!=0) {
                    for (var i = 0;i<=doc.Appointment.length-1; i++){
                        if (doc.Appointment[i].location === req.body.location) {
                        if (doc.Appointment[i].for.length!=0){
                            for (var j=0;j<=doc.Appointment[i].for.length-1;j++) {
                                 myAppointment.push({
                                    "id":doc.Appointment[i]._id,
                                    "patient":doc.Appointment[i].patient,
                                    "location":doc.Appointment[i].location,
                                    "disease":doc.Appointment[i].for[j].disease,
                                    "appointmentId":doc.Appointment[i].for[j]._id,
                                    "appointmentTime":doc.Appointment[i].for[j].appointmentTime,
                                    "rescheduledTime":doc.Appointment[i].for[j].rescheduledTime,

                                })
                            }
                        }
                    }
            }
               if (myAppointment.length== 0) {
                    res.send({status: false, info:"Currently You dont have any appointments for this location"});
                } else {
            res.send({status: true, Appointment: myAppointment});
        }
                    // res.send({status: true, Appointment: doc.Appointment});
                } else {
                    res.send({status: false, info:"Currently You dont have any appointments"});
                }
            }
        })
})
router.put('/rescheduled/appointment/current/patient', function (req, res) {
    console.log(req.body);
    Doctor.findById(req.userId, function (err, doc) {
        if (err)
            res.send({status: false, info:err});
        for (var i=doc.Appointment.length-1; i>=0;  i--) {
            if (doc.Appointment[i]._id == req.body.patientId) {
                var appointmentFor =doc.Appointment[i].for;
                console.log(appointmentFor.length);
                for (var j=appointmentFor.length-1; j>=0; j--) {
                    if (appointmentFor[j]._id== req.body.appointmentId) {
                        appointmentFor[j].rescheduledTime = req.body.rescheduledTime;
                        doc.save(function (err, doctor) {
                            if (err) {
                                res.send(err)
                            }else {
                                res.send({Status: true, info:"Success"});
                            }
                        })
                    } else {
                        res.send({status: false, info:"No Appointment found for given AppointmentId"})
                    }
                }
            } else {
                res.send({status: false, info:"No Patient found for given PatientId"})
            }
        }
    })
})
router.post('/add/appointment/current/patient', function (req, res) {
    console.log(req.body);
    Doctor.findById(req.userId, function (err, doc) {
        if (err)
            res.send({status: false, info:err})
        for (var i=doc.Appointment.length-1; i>=0;  i--) {
            if (doc.Appointment[i]._id == req.body.patientId) {
                doc.Appointment[i].for.push({
                    "disease": req.body.dieses, "appointmentTime": req.body.appointmentTime,
                    "status": req.body.status
                })
                // doc.Appointment[0].location= req.body.location;

                doc.save(function (err, data) {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send({status: true, info: "Appointment saved"});
                    }
                })
            }
        }
    })
})
router.route('/follow/doctor')
    .post(function (req, res) {
        console.log(req.body.id);
        Doctor.findById(req.userId, function (err, doc) {
            if (err)
                res.send({status: false, info:err});

            doc.follow.push(req.body.id);

            doc.save(function (err, doctor) {
                if (err)
                    res.send({status:false, info:err})
                // res.send({status: true, info:"Success"})
            })
        })
        Doctor.findById(req.body.id, function (err, doctor) {
            if (err) {
                res.send({status: false, info: err})
            } else {
                doctor.following.push(req.userId);

                doctor.save(function (err, doctor) {
                    if (err) {
                        res.send({status: false, info: err})
                    } else {
                        res.send({status: true, info: "Success"})
                    }
                })
            }
        })
    })

module.exports = router;