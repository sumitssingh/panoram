
var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
var _ = require('underscore');
var upload = multer({dest: 'upload/'})
var Doctor = mongoose.model('Doctor');
var OnCall = mongoose.model('OnCall');
var Location = mongoose.model('Location');
var ensureAuthenticated = require('../../authMiddleWare');

router.use(ensureAuthenticated);

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
    Location.find({}, function (err, doc) {
    if (err) {
        res.send({status: false, info: "Something is not right"})
    } else{
        res.send(doc);
    }
    })
})
router.get('/getAllDoctors/name', function (req, res) {
    if (req.isAdmin) {
        Doctor.find({}, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            }
            console.log(doc);
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
router.get('/getAppointmentByDoctor/:docId', function (req, res) {
    if (req.isAdmin) {
        Doctor.findById(req.params.docId, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            }else {
                var myAppointment = [];
                if (doc.Appointment.length!=0) {
                    for (var i = 0;i<=doc.Appointment.length-1; i++){
                        myAppointment.push({
                            "location":doc.Appointment[i].location,
                            "status":doc.Appointment[i].status,
                            "appointmentId":doc.Appointment[i]._id,
                            "appointmentTime":doc.Appointment[i].appointmenTime,
                            "rescheduledTime":doc.Appointment[i].rescheduledTime,
                        })
                    }
                    res.send({status: true, Appointment: myAppointment});
                } else {
                    res.send({status: false, info:"Currently You dont have any appointments"});
                }
            }    
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
})
router.post('/getAppointmentByDoctor/date/:docId/:date', function (req, res) {
    console.log(req.params.date);
    console.log(req.body.date);
    if (req.isAdmin) {
        Doctor.findById(req.params.docId, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            }else {
                var myAppointment = [];

                if (doc.Appointment.length!=0) {
                    for (var i = 0;i<=doc.Appointment.length-1; i++){
                        var date = new Date(doc.Appointment[i].appointmentTime);
                        var month = date.getMonth();
                        var year  = date.getFullYear();
                        var day = date.getDate()
                        var reqDate = new Date(req.params.date);
                        var reqMonth = reqDate.getMonth();
                        var reqYear = reqDate.getFullYear();
                        var reqDay = reqDate.getDate();
                        if (month === reqMonth && year === reqYear && day === reqDay) {
                            console.log(date);
                            myAppointment.push({
                                "id":doc.Appointment[i]._id,
                                'status':doc.Appointment[i].status,
                                "location":doc.Appointment[i].location,
                                "appointmentTime":doc.Appointment[i].appointmenTime,
                                "rescheduledTime":doc.Appointment[i].rescheduledTime,

                            })
                        }
                    }
                    res.send({status: true, Appointment: myAppointment});
                } else {
                    res.send({status: false, info:"Currently You dont have any appointments"});
                }
            }
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
})
// router.post('/getAppointmentByDoctor/date/:docId/:date', function (req, res) {
//     if (req.isAdmin) {
//         Doctor.findById(req.params.docId, function (err, doc) {
//             if (err) {
//                 res.send({status: false, info: "Something is not right"})
//             }else {
//                 var myAppointment = [];
//                 if (doc.Appointment.length!=0) {
//                     for (var i = 0;i<=doc.Appointment.length-1; i++){
//                         if (doc.Appointment[i]._id == req.params.patientId) {
//                                 console.log("esfwed");
//                             if (doc.Appointment[i].for.length!=0) {
//                             for (var j=0;j<=doc.Appointment[i].for.length-1;j++) {
                            
//                                  myAppointment.push({
//                                     "id":doc.Appointment[i]._id,
//                                     "patient":doc.Appointment[i].patient,
//                                     "location":doc.Appointment[i].location,
//                                     "disease":doc.Appointment[i].for[j].disease,
//                                     "appointmentId":doc.Appointment[i].for[j]._id,
//                                     "appointmentTime":doc.Appointment[i].for[j].appointmentTime,
//                                     "rescheduledTime":doc.Appointment[i].for[j].rescheduledTime,

//                                 })
//                             }
//                         }
//                     }
//                     }
//                     res.send({status: true, Appointment: myAppointment});
//                 } else {
//                     res.send({status: false, info:"Currently You dont have any appointments"});
//                 }
//             }
//         })
//     } else {
//         res.send({status: false, info: "Sorry You are not admin"})
//     }
// })
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
            var date = req.body[i].time;
            Doctor.findOne({username:req.body[i].doctor}, function(err, user){
                 if (err) {
                    res.send(err)
                } else {
                    var providerId = user._id;
                    var emergencyCall = new OnCall();
                    emergencyCall.doctor=providerId;
                    emergencyCall.location=location;
                    emergencyCall.date=date;

                    emergencyCall.save(function(err, provider){
                        if (err) {
                            res.send(err)
                        }else {
                            user.notification.push({
                                "type":"OnCall",
                                "event":provider._id,
                                "text":"You have assigned an emergencyCall"
                            })
                            user.save(function (err, data) {
                                if (err) {
                                    res.send(err)
                                }
                            })
                        } 
                    })
                 }
                    
            })
        }

        res.send({status: true, info: "Successfully Added"});
    })
    .put(function(req, res){
        OnCall.remove({_id: req.body.id}, function(err, data) {
            if (err) {
                res.send({status: "error", "error": err})
            } else{
                res.send(data);
            }
        })
    })
router.get('/profile/:id', function(req, res, next) {
    if (req.isAdmin) {
    Doctor.findById(req.params.id, function (err, doctor) {
        if (err) {
            res.send(err)
        } else {
            res.send(doctor.Appointment);
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
                doctor.username = req.body.username;
                doctor.save(function(err, doctor) {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send({status: true, info: "Success"});
                    }
                })
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
        doctor.doctorDp.data = fs.readFileSync(req.files[0].path);
        doctor.doctorDp.contentType = req.files[0].mimetype;
        doctor.save(function (err, a) {
            if (err)
                res.send(err);
            res.send(req.files);
        })
    })
});
router.post('/create/appointment/:docId', function (req, res) {
     Doctor.findById(req.params.docId, function (err, doc) {
        if (err) {
            res.send({status: false, info:err});
        } else {
            doc.Appointment.push({
                "location": req.body.location,
                "appointmentTime": req.body.appointmentTime,
                "appointmentType": req.body.appointmentType,
                "description": req.body.description
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
router.put('/rescheduled/appointment/:docId/:appointmentId', function (req, res) {
    Doctor.findById(req.params.docId, function (err, doc) {
        if (err) {
            res.send({status: false, info:err});
        } else {
            for (var i=doc.Appointment.length-1; i>=0;  i--) {
                if (doc.Appointment[i]._id == req.params.AppointmentId) {
                    doc.Appointment[i].rescheduledTime = req.body.rescheduledTime;
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
        }
    })
}) 
// router.route('/follow/me/:id')
//     .get(function(req, res){
//         Doctor.findById(req.params.id, function(err, user){
//             if(err)
//                 res.send(err);
//             var myMatch = user.following.map(function(ele) {
//                 return ele;
//             });
//             Doctor.find({
//                 _id: {
//                     $in: myMatch
//                 }
//             },function(err, docs) {
//                 res.send(docs)
//             });
//         });
//     })
// router.route('/following/:id')
//     .get(function(req, res){
//         Doctor.findById(req.params.id, function(err, user){
//             if(err)
//                 res.send(err);
//             if (user.follow.length>0) {
//                 var myMatch = user.follow.map(function (ele) {
//                     return ele;
//                 });
//                 Doctor.find({
//                     _id: {
//                         $in: myMatch
//                     }
//                 },function(err, docs) {
//                     res.send(docs)
//                 });
//             } else {
//                 res.send({status: false, info: "You currently not follow any doctor"})
//             }

//         });
//     })
// router.post('/create/appointment/:docId', function (req, res) {
//     Doctor.findById(req.params.docId, function (err, doc) {
//         if (err) {
//             res.send({status: false, info:err});
//         } else {
//         if (doc != null) {
//             if (doc.Appointment.length>0 ) {
//                 var isPatient;
//                 doc.Appointment.map(function(items, index){
//                     if (items.patient === req.body.patient) {
//                         patientIndex = index;
//                         return patientIndex
//                     }
//                 })
//                 doc.Appointment[patientIndex].for.push({
//                     "disease": req.body.disease,
//                     "location": req.body.location,
//                     "appointmentTime": req.body.appointmentTime,
//                     "status": req.body.status
//                 })
//                 doc.save(function (err, data) {
//                     if (err) {
//                         res.send(err)
//                     } else {
//                         res.send({status: true, info: "Appointment saved"});
//                     }
//                 })
//             }
//             else {
//                 doc.Appointment.push({"patient": req.body.patient})
//                 doc.Appointment[0].for.push({
//                     "location": req.body.location,
//                     "disease": req.body.disease,
//                     "appointmentTime": req.body.appointmentTime,
//                     "status": req.body.status
//                 })
//                 doc.save(function (err, data) {
//                     if (err) {
//                         res.send(err)
//                     } else {
//                         res.send({status: true, info: "Appointment saved"});
//                     }
//                 })
//             }
//         } else{
//             res.send({status: false, info: "No Document find with this id"});
//         }
//     }
//     })
// })
// router.post('/add/appointment/current/patient', function (req, res) {
//     console.log(req.body);
//     Doctor.findById(req.params.id, function (err, doc) {
//         if (err)
//             res.send({status: false, info:err})
//         for (var i=doc.Appointment.length-1; i>=0;  i--) {
//             if (doc.Appointment[i]._id == req.body.patientId) {
//                 doc.Appointment[i].for.push({
//                     "disease": req.body.dieses, "appointmentTime": req.body.appointmentTime,
//                     "status": req.body.status
//                 })
//                 doc.save(function (err, data) {
//                     if (err) {
//                         res.send(err)
//                     } else {
//                         res.send({status: true, info: "Appointment saved"});
//                     }
//                 })
//             }
//         }
//     })
// })
// router.route('/follow/doctor/:id')
//     .post(function (req, res) {
//         Doctor.findById(req.params.id, function (err, doc) {
//             if (err)
//                 res.send({status: false, info:err});

//             doc.follow.push(req.body.id);

//             doc.save(function (err, doctor) {
//                 if (err)
//                     res.send({status:false, info:err})
//             })
//         })
//         Doctor.findById(req.body.id, function (err, doctor) {
//             if (err) {
//                 res.send({status: false, info: err})
//             } else {
//                 doctor.following.push(req.params.id);

//                 doctor.save(function (err, doctor) {
//                     if (err) {
//                         res.send({status: false, info: err})
//                     } else {
//                         res.send({status: true, info: "Success"})
//                     }
//                 })
//             }
//         })
//     })
// router.route('/onCall')
//     .post(function(req, res){
//         for (var i = req.dody.length - 1; i >= 0; i--) {
//             Doctor.findOne({username: req.body[i].doctor}, function(err, user){
//                 if (err) {
//                     res.send(err)
//                 } else {
//                     var newOnCall = new OnCall();
//                     newOnCall.doctor= user._id;
//                     newOnCall.location = req.body[i].location;
//                     newOnCall.date = req.body[i].time;

//                     newOnCall.save(function(err, user){
//                         if (err) {
//                             res.send(err)
//                         }
//                     })       
//                 }
//             })
            
//         }
//         res.send({status: true, info: "Data Successfully saved"});
//     })

module.exports = router;







