
var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
var upload = multer({dest: 'upload/'})
var Doctor = mongoose.model('Doctor');
var OnCall = mongoose.model('OnCall');
var Hospital = mongoose.model('Hospital');
var ensureAuthenticated = require('../../authMiddleWare');

router.use(ensureAuthenticated);
/* GET users listing. */
router.get('/getAllDoctors', function (req, res) {
    if (req.isAdmin) {
        Doctor.find({}, function (err, doc) {
            if (err)
                res.send({status: false, info: "Something is not right"})
            res.send({status: true, doctor: doc});
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
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
router.get('/getAllDoctors/name', function (req, res) {
    console.log(req.isAdmin);
    if (req.isAdmin) {
        Doctor.find({}, function (err, doc) {
            if (err)
                res.send({status: false, info: "Something is not right"})
            var docName = doc.map(function (name) {
                return data = {
                    "name" : name.username,
                "id": name._id
            };
            })
            res.send({status: true, doctor: docName});
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
})
router.get('/getAppointmentByDoctor/:id', function (req, res) {
    if (req.isAdmin) {
        Doctor.findById(req.params.id, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            }else {
                var myAppointment = [];
                if (doc.Appointment.length!=0) {
                    for (var i = 0;i<=doc.Appointment.length-1; i++){
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
                    res.send({status: true, Appointment: myAppointment});
                    // res.send({status: true, Appointment: doc.Appointment});
                } else {
                    res.send({status: false, info:"Currently You dont have any appointments"});
                }
            }
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
})
router.post('/getAppointmentByDoctor/patient/:id/:patientId', function (req, res) {
    if (req.isAdmin) {
        Doctor.findById(req.params.id, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            }else {
                var myAppointment = [];
                if (doc.Appointment.length!=0) {
                    for (var i = 0;i<=doc.Appointment.length-1; i++){
                        console.log(doc.Appointment[i]._id);
                        console.log(req.params.patientId);
                        console.log(doc.Appointment[i].for.length);
                        if (doc.Appointment[i]._id == req.params.patientId) {
                                console.log("esfwed");
                            if (doc.Appointment[i].for.length!=0) {
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
                    res.send({status: true, Appointment: myAppointment});
                    // res.send({status: true, Appointment: doc.Appointment});
                } else {
                    res.send({status: false, info:"Currently You dont have any appointments"});
                }
            }
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
})
router.route('/onCall/providers')
    .get(function(req, res){
        OnCall.find({}, function(err, posts) {
        OnCall.populate(posts, {path: 'doctor'}, function(err, posts) {
            if (err) {
                res.send({status: "error", "error": err})
            } else{
                res.send(posts);
            }
    })
    })
        })
    .post(function(req, res){
        for (var i = req.body.length - 1; i >= 0; i--) {
            var location = req.body[i].location;
            var time = req.body[i].time;
        Doctor.findOne({username:req.body[i].doctor}, function(err, user){
             if (err) {
                res.send(err)
             } else {
                console.log(req.body[i]);
                var providerId = user._id;
                var emergencyCall = new OnCall();
                emergencyCall.doctor=providerId;
                emergencyCall.location=location;
                emergencyCall.date=time;

                emergencyCall.save(function(err, provider){
                    if (err) {
                        res.send(err)
                    } 
                })
             }
                
        })
    }
    res.send({status: true, info: "Successfully Added"});
    })
router.get('/profile/:id', function(req, res, next) {
    if (req.isAdmin) {
    Doctor.findById(req.params.id, function (err, doctor) {
        if (err) {
            res.send(err)
        } else {
            // res.contentType(doctor.doctorDp.contentType);
            res.send(doctor.Appointment);
            // res.write(doctor);
        }
    })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
});

router.post('/manage/profile/:id', function(req, res, next) {
    if (req.isAdmin) {
        Doctor.findById(req.params.id, function (err, doctor) {
            if (err) {
                res.send(err)
            } else {
                // res.contentType(doctor.doctorDp.contentType);
                doctor.username = req.body.username;
                doctor.save(function(err, doctor) {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send({status: true, info: "Success"});
                    }
                })
                // res.write(doctor);
            }
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
});

router.post('/edit/dp/:id', upload.any(), function (req, res) {
    Doctor.findById(req.params.id, function (err, doctor) {
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
router.route('/follow/me/:id')
    .get(function(req, res){
        Doctor.findById(req.params.id, function(err, user){
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
router.route('/following/:id')
    .get(function(req, res){
        Doctor.findById(req.params.id, function(err, user){
            if(err)
                res.send(err);
if (user.follow.length>0) {
    var myMatch = user.follow.map(function (ele) {
        return ele;
    });
    Doctor.find({
        _id: {
            $in: myMatch
        }
    },function(err, docs) {
        res.send(docs)
    });
} else {
    res.send({status: false, info: "You currently not follow any doctor"})
}

        });
    })
router.post('/create/appointment/:id', function (req, res) {
    console.log(req.params.id);
    Doctor.findById(req.params.id, function (err, doc) {
        if (err) {
            res.send({status: false, info:err});
        } else {

        // console.log(doc.Appointment.length);
            if (doc != null) {
        if (doc.Appointment.length>=1 ) {
            for (var i = doc.Appointment.length; i > 0; i--) {
                console.log(i);
                doc.Appointment.push({"patient": req.body.patient, "location": req.body.location})
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
            doc.Appointment.push({"patient": req.body.patient, "location": req.body.location})
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
    } else{
        res.send({status: false, info: "No Document find with this id"});
    }
    }
    })
})
router.put('/rescheduled/appointment/current/patient/:id', function (req, res) {
    Doctor.findById(req.params.id, function (err, doc) {
        if (err) {
            res.send({status: false, info:err});
        }
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
    Doctor.findById(req.params.id, function (err, doc) {
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
router.route('/follow/doctor/:id')
    .post(function (req, res) {
        console.log(req.body.id);
        Doctor.findById(req.params.id, function (err, doc) {
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
                doctor.following.push(req.params.id);

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
router.route('/onCall')
    .post(function(req, res){
        for (var i = req.dody.length - 1; i >= 0; i--) {
            Doctor.findOne({username: req.body[i].doctor}, function(err, user){
                if (err) {
                    res.send(err)
                } else {
                    var newOnCall = new OnCall();
                    newOnCall.doctor= user._id;
                    newOnCall.location = req.body[i].location;
                    newOnCall.time = req.body[i].time;

                    newOnCall.save(function(err, user){
                        if (err) {
                            res.send(err)
                        }
                    })       
                }
            })
            
        }
        res.send({status: true, info: "Data Successfully saved"});
    })
module.exports = router;







