 var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var multer = require('multer');
var _ = require('underscore');
var async = require('async');
var upload = multer({dest: 'upload/'})
var Doctor = mongoose.model('Doctor');
var OnCall = mongoose.model('OnCall');
var Hospital = mongoose.model('Hospital');
var ensureAuthenticated = require('../authMiddleWare');


router.get('/fetchAllDoctor', function (req, res) {
    Doctor.find({}, function (err, doc) {
        if (err) {
            res.send({status: false, info: "Something is not right"})
        } else {
            res.send({status: true, doctor:doc});
        }
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
          res.send(doctor);
      }
  })
});

router.post('/upload/dp', upload.any(), function (req, res) {
    Doctor.findById(req.userId, function (err, doctor) {
        if (err) {
            res.send(err)
        } else {
            doctor.doctorDp.data = fs.readFileSync(req.files[0].path);
            doctor.doctorDp.contentType = req.files[0].mimetype;
            doctor.save(function (err, a) {
                if (err) {
                    res.send(err);
                } else {
                res.send(req.files);
                }
            })
        }
    })
});
router.route('/follow/me')
    .get(function(req, res){
        Doctor.findById(req.userId, function(err, user){
            if(err) {
                res.send(err);
            }else {
                var myMatch = user.following.map(function(ele) {
                    return ele;
                });
                Doctor.find({_id: {$in: myMatch}},function(err, docs) {
                    if (err) {
                        res.send(err);
                    }else {
                        res.send(docs);
                    }
                });
            }
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
            Doctor.find({_id: {$in: myMatch}},function(err, docs) {
                if (err) {
                    res.send(err);
                }else {
                    res.send(docs);
                }
            });
        });
    })
// router.post('/create/appointment', function (req, res) {
//     Doctor.findById(req.userId, function (err, doc) {
//         if (err) {
//             res.send({status: false, info:err});
//         } else {
//             if (doc.Appointment.length>=1) {
//                 for (var i = doc.Appointment.length; i > 0; i--) {
//                     console.log(i);
//                     doc.Appointment.push({"patient": req.body.patientName, "location": req.body.location})
//                     doc.Appointment[i].for.push({
//                         "disease": req.body.disease, "appointmentTime": req.body.appointmentTime,
//                         "status": req.body.status
//                     })
//                     doc.save(function (err, data) {
//                         if (err) {
//                             res.send(err)
//                         } else {
//                             res.send({status: true, info: "Appointment saved"});
//                         }
//                     })
//                 }
//             } else {
//                 doc.Appointment.push({"patient": req.body.patientName, "location": req.body.location})
//                 doc.Appointment[0].for.push({
//                     "disease": req.body.disease, "appointmentTime": req.body.appointmentTime,
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
router.post('/getAppointmentByDoctor', function (req, res) {
        Doctor.findById(req.body.id, function (err, doc) {
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
                            "appointmentTime":doc.Appointment[i].appointmentTime,
                            "rescheduledTime":doc.Appointment[i].rescheduledTime,
                        })
                    }
                    res.send({status: true, Appointment: myAppointment});
                } else {
                    res.send({status: false, info:"Currently You dont have any appointments"});
                }
            } 
        })
})
// router.put('/rescheduled/appointment/current/patient', function (req, res) {
//     console.log(req.body);
//     Doctor.findById(req.userId, function (err, doc) {
//         if (err) {
//             res.send({status: false, info:err});
//         } else {
//             for (var i=doc.Appointment.length-1; i>=0;  i--) {
//                 if (doc.Appointment[i]._id == req.body.patientId) {
//                     var appointmentFor =doc.Appointment[i].for;
//                     console.log(appointmentFor.length);
//                     for (var j=appointmentFor.length-1; j>=0; j--) {
//                         if (appointmentFor[j]._id== req.body.appointmentId) {
//                             appointmentFor[j].rescheduledTime = req.body.rescheduledTime;
//                             doc.save(function (err, doctor) {
//                                 if (err) {
//                                     res.send(err)
//                                 }else {
//                                     res.send({Status: true, info:"Success"});
//                                 }
//                             })
//                         } else {
//                             res.send({status: false, info:"No Appointment found for given AppointmentId"})
//                         }
//                     }
//                 } else {
//                     res.send({status: false, info:"No Patient found for given PatientId"})
//                 }
//             }
//         }    
//     })
// })
// router.post('/add/appointment/current/patient', function (req, res) {
//     console.log(req.body);
//     Doctor.findById(req.userId, function (err, doc) {
//         if (err)
//             res.send({status: false, info:err})
//         for (var i=doc.Appointment.length-1; i>=0;  i--) {
//             if (doc.Appointment[i]._id == req.body.patientId) {
//                 doc.Appointment[i].for.push({
//                     "disease": req.body.disease, "appointmentTime": req.body.appointmentTime,
//                     "status": req.body.status
//                 })
//                 // doc.Appointment[0].location= req.body.location;

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
router.route('/follow/doctor')
    .post(function (req, res) {
        console.log(req.body.id);
        Doctor.findById(req.userId, function (err, doc) {
            if (err) {
                res.send({status: false, info:err});
            }
            else {
                if(doc.follow.indexOf(req.body.id) < 0) {
                    doc.follow.push(req.body.id);
                    doc.save(function (err, doctor) {
                        if (err) {
                            res.send({status:false, info:err})
                		} else {
                        Doctor.findById(req.body.id, function (err, doctor) {
                            if (err) {
                                res.send({status: false, info: err})
                            } else {
                                if(doc.follow.indexOf(req.userId) < 0) {
                                    doctor.following.push(req.userId);
                                    doctor.notification.push({
                                          'type':'following',
                                            "text":"Doctor " + doc.username + "now following you",
                                            "doctorId": doc._id
                                    })
                                    doctor.save(function (err, doctor) {
                                        if (err) {
                                            res.send({status: false, info: err})
                                        } else {

                                            res.send({status: true, info: "Success"})
                                        }
                                    })
                                } else{
                                    res.send({status: false, info:"Already Member"});  
                                }
                            }
                        })
                    }
                })
            } else {
                res.send({status: false, info:"Already Member"});  
            }
        }
    })
})
router.post('/unFollow/doctor', function (req, res) {
    Doctor.findById(req.userId, function (err, doc) {
        if (err) {
            res.send({status: false, info:err});
        } else {
                var index = doc.follow.map(function(doctor, index){
                    if (doctor === req.body.id) {
                        return index;
                    }
                })
                doc.follow.splice(index, 1);
                doc.save(function (err, doctor) {
                    if (err) {
                        res.send({status:false, info:err})
                    } else {
                            Doctor.findById(req.body.id, function (err, doctor) {
                                if (err) {
                                    res.send({status: false, info: err})
                                } else {
                                var index = doctor.following.map(function(doc, index){
                                    if (doc === req.userId) {
                                        return index;
                                }
                            })
                            doctor.following.splice(index, 1);
                            doctor.notification.push({
                                'type':'unfollow',
                                "text": doc.username + ' UnFollowed you',
                                "doctorId": doc._id
                            })
                            doctor.save(function (err, doctor) {
                                if (err) {
                                    res.send({status: false, info: err})
                                } else {
                                   res.send({status: true, info: "Success"})
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
router.route('/onCall/providers')
    .get(function(req, res){
        OnCall.find({}, function(err, posts) {
        OnCall.populate(posts, {path: 'doctor'}, function(err, posts) {
            if (err) {
                res.send({status: "error", "error": err})
            } else{
                var onCallEvents =[];
                _.forEach(posts, function(provider) {
                    onCallEvents.push({'id':provider._id,'location':provider.location,'doctor':provider.doctor.username,'doctorId':provider.doctor._id,'date':provider.date})
                return onCallEvents;
            })
            res.send(onCallEvents);
        }
        })
    })
})
router.get('/my/notification', function(req, res) {
    Doctor.findById(req.userId, function (err, doc) {  
     if (err) {
            res.send(err);
        }else {
             var myNotification =[];
                _.forEach(doc.notification, function(event) {
                    if (event.isRead === false) {
                        myNotification.push({'id':event._id,'text':event.text});
                    }
                return myNotification;
            })
                res.send(myNotification);
        }  
    })
})        
// router.get('/my/notification', function(req, res) {
//     Doctor.findById('5a222a4b2364fa07c43041af', function (err, doc) {
//         if (err) {
//             res.send(err);
//         }else {
//             async.waterfall([
//                 function(done) {
//                     var myNotification =[];
//                      _.forEach(doc.notification, function(connection) {
//                     if (connection.isRead === false) {    
//                         OnCall.populate(connection, {path: 'event'}, function(err, events) {
//                             if (err) {
//                                 res.send({status: "error", "error": err})
//                             } else{
//                                 myNotification.push({'id':events._id,'text':events.text,'location':events.event.location,'date':events.event.date});
//                             }
//                         })
//                         return myNotification;
//                         }
//                         done(err, myNotification);
//                     })
//                 },function(myNotification, done) {
    
//                         res.send(myNotification);
//                     }
//             ], function(err) {
//                 if (err)
//                     res.send({status: false, error: err});
//             });
//             }     
//         })
//     })
router.get('/notification/read', function(req, res){
   Doctor.findById(req.userId, function(err, doc){
     _.forEach(doc.notification, function(event) {
            event.isRead = true;
            })
        doc.save(function (err, data) {
            if (err) {
                res.send(err)
            } else{
                res.send({status:true, info:"Success"});
            }
        })
    })    
})     
    // .post(function(req, res){
    //     for (var i = req.body.length - 1; i >= 0; i--) {
    //         var location = req.body[i].location;
    //         var time = req.body[i].time;
    //     Doctor.findOne({username:req.body[i].doctor}, function(err, user){
    //          if (err) {
    //             res.send(err)
    //          } else {
    //             console.log(req.body[i]);
    //             var providerId = user._id;
    //             var emergencyCall = new OnCall();
    //             emergencyCall.doctor=providerId;
    //             emergencyCall.location=location;
    //             emergencyCall.date=time;

    //             emergencyCall.save(function(err, provider){
    //                 if (err) {
    //                     res.send(err)
    //                 } 
    //             })
    //          }
                
    //     })
    // }
    // res.send({status: true, info: "Successfully Added"});
    // })
    // .put(function(req, res){
    //     OnCall.remove({_id: req.body.id}, function(err, data) {
    //         if (err) {
    //             res.send({status: "error", "error": err})
    //         } else{
    //             res.send(data);
    //         }
    //     })
    // })
module.exports = router;
