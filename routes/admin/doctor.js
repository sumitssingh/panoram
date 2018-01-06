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
        } else {
            res.send(doc);
        }
    })
})
router.get('/fetch/All/type', function (req, res) {
    Doctor.find({}, 'Appointment.appointmentType', function (err, doc) {
        if (err) {
            res.send({status: false, info: "Something is not right"})
        } else {
            var appointment = [];
                doc.map(function(type) {
                type.Appointment.map(function (t) {
                    appointment.push(t.appointmentType);
                })
           });
           var appointmentType =  appointment.filter(function(elem, index, self) {
               return index == self.indexOf(elem);
           })
            res.send(appointmentType);
        }
    })
});
router.get('/getAllDoctors/name', function (req, res) {
    if (req.isAdmin) {
        Doctor.find({}, function (err, doc) {
            if (err)
                res.send({status: false, info: "Something is not right"})
            var docName = doc.map(function (name) {
                return data = {
                    "name": name.username,
                    "id": name._id
                };
            })
            res.send({status: true, doctor: docName});
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
});
router.get('/getAppointmentByDoctor/type/:docId/:type', function (req, res) {
    if (req.isAdmin) {
        Doctor.findById(req.params.docId, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            } else {
                var myAppointment = [];
                if (doc.Appointment.length != 0) {
                    for (var i = 0; i <= doc.Appointment.length - 1; i++) {
                        if (doc.Appointment[i].appointmentType === req.params.type) {
                            myAppointment.push({
                                "location": doc.Appointment[i].location,
                                "status": doc.Appointment[i].status,
                                "appointmentId": doc.Appointment[i]._id,
                                "appointmentTime": doc.Appointment[i].appointmentTime,
                                "rescheduledTime": doc.Appointment[i].rescheduledTime,
                                "appointmentType": doc.Appointment[i].appointmentType,
                                "description": doc.Appointment[i].description,
                            })
                        }
                        // }else {
                        // res.write({status: false, info: "No appointment found for this location"});
                        // res.end();
                        // }
                    }
                    res.send({status: true, Appointment: myAppointment});
                } else {
                    res.send({status: false, info: "Currently You dont have any appointments"});
                }
            }
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
});
router.get('/getAppointmentByDoctor/:docId', function (req, res) {
    if (req.isAdmin) {
        Doctor.findById(req.params.docId, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            } else {
                var myAppointment = [];
                if (doc.Appointment.length != 0) {
                    for (var i = 0; i <= doc.Appointment.length - 1; i++) {
                        myAppointment.push({
                            "location": doc.Appointment[i].location,
                            "status": doc.Appointment[i].status,
                            "appointmentId": doc.Appointment[i]._id,
                            "appointmentTime": doc.Appointment[i].appointmentTime,
                            "rescheduledTime": doc.Appointment[i].rescheduledTime,
                            "appointmentType": doc.Appointment[i].appointmentType,
                            "description": doc.Appointment[i].description,
                        })
                    }
                    res.send({status: true, Appointment: myAppointment});
                } else {
                    res.send({status: false, info: "Currently You dont have any appointments"});
                }
            }
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
});
router.get('/getAppointmentByDoctor/:docId/location/:location', function (req, res) {
    if (req.isAdmin) {
        Doctor.findById(req.params.docId, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            } else {
                var myAppointment = [];
                if (doc.Appointment.length != 0) {
                    for (var i = 0; i <= doc.Appointment.length - 1; i++) {
                        if (doc.Appointment[i].location === req.params.location) {
                            myAppointment.push({
                                "location": doc.Appointment[i].location,
                                "status": doc.Appointment[i].status,
                                "appointmentId": doc.Appointment[i]._id,
                                "appointmentTime": doc.Appointment[i].appointmentTime,
                                "rescheduledTime": doc.Appointment[i].rescheduledTime,
                                "appointmentType": doc.Appointment[i].appointmentType,
                                "description": doc.Appointment[i].description,
                            })
                        }
                    }
                    res.send({status: true, Appointment: myAppointment});
                } else {
                    res.send({status: false, info: "Currently You dont have any appointments"});
                }
            }
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
});
router.get('/getAppointmentByDoctor/:docId/:location/:type', function (req, res) {
    if (req.isAdmin) {
        Doctor.findById(req.params.docId, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            } else {
                var myAppointment = [];
                if (doc.Appointment.length != 0) {
                    for (var i = 0; i <= doc.Appointment.length - 1; i++) {
                        if (doc.Appointment[i].location === req.params.location && doc.Appointment[i].appointmentType === req.params.type) {
                            myAppointment.push({
                                "location": doc.Appointment[i].location,
                                "status": doc.Appointment[i].status,
                                "appointmentId": doc.Appointment[i]._id,
                                "appointmentTime": doc.Appointment[i].appointmentTime,
                                "rescheduledTime": doc.Appointment[i].rescheduledTime,
                                "appointmentType": doc.Appointment[i].appointmentType,
                                "description": doc.Appointment[i].description,
                            })
                        }
                    }
                    res.send({status: true, Appointment: myAppointment});
                } else {
                    res.send({status: false, info: "Currently You dont have any appointments"});
                }
            }
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
});
router.post('/getAppointmentByDoctor/date/:docId/:date', function (req, res) {
    if (req.isAdmin) {
        Doctor.findById(req.params.docId, function (err, doc) {
            if (err) {
                res.send({status: false, info: "Something is not right"})
            } else {
                var myAppointment = [];

                if (doc.Appointment.length != 0) {
                    for (var i = 0; i <= doc.Appointment.length - 1; i++) {
                        var date = new Date(doc.Appointment[i].appointmentTime);
                        var month = date.getMonth();
                        var year = date.getFullYear();
                        var day = date.getDate()
                        var reqDate = new Date(req.params.date);
                        var reqMonth = reqDate.getMonth();
                        var reqYear = reqDate.getFullYear();
                        var reqDay = reqDate.getDate();
                        if (month === reqMonth && year === reqYear && day === reqDay) {
                            myAppointment.push({
                                "id": doc.Appointment[i]._id,
                                'status': doc.Appointment[i].status,
                                "location": doc.Appointment[i].location,
                                "appointmentTime": doc.Appointment[i].appointmentTime,
                                "rescheduledTime": doc.Appointment[i].rescheduledTime,
                                "appointmentType": doc.Appointment[i].appointmentType,
                                "description": doc.Appointment[i].description,

                            })
                        }
                    }
                    res.send({status: true, Appointment: myAppointment});
                } else {
                    res.send({status: false, info: "Currently You dont have any appointments"});
                }
            }
        })
    } else {
        res.send({status: false, info: "Sorry You are not admin"})
    }
});
router.route('/onCall/providers')
    .get(function (req, res) {
        OnCall.find({}, function (err, posts) {
            OnCall.populate(posts, {path: 'doctor'}, function (err, posts) {
                if (err) {
                    res.send({status: "error", "error": err})
                } else {
                    res.send(posts);
                }
            })
        })
    })
    .post(function (req, res) {
        _.forEach(req.body, function(data){
            var doctorName = data.doctor;
            Doctor.findOne({username: doctorName}, function (err, user) {
                if (err) {
                    res.send(err)
                } else {
                    var providerId = user._id;
                    var doctorName = user.username;
                    var location = data.location;
                    var date = data.time;
                    var emergencyCall = new OnCall();
                    emergencyCall.doctor = providerId;
                    emergencyCall.location = location;
                    emergencyCall.date = date;

                    emergencyCall.save(function (err, provider) {
                        if (err) {
                            res.send(err)
                        } else {
                            user.notification.push({
                                "type": "OnCall",
                                "event": provider._id,
                                "text": doctorName + ", your new on call schedule is now available.",
                                "doctorId": providerId
                            });
                            user.save(function (err, data) {
                                if (err) {
                                    res.send(err)
                                }
                            })
                        }
                    })
                }
            })
        })
        res.send({status: true, info: "Successfully Added"});
    })
                    // .post(function (req, res) {
                    //     for (var i = req.body.length-1; i >= 0; i--) {
                    //         console.log(req.body[0]);
                    //         var location = req.body[i].location;
                    //         var date = req.body[i].time;
                    //         var count= 0;
                    //         count = count+1;
                    //         // console.log(count);
                    //         Doctor.findOne({username: req.body[i].doctor}, function (err, user) {
                    //             if (err) {
                    //                 res.send(err)
                    //             } else {
                    //                 var providerId = user._id;
                    //                 var doctorName = user.username;
                    //                 var emergencyCall = new OnCall();
                    //                 emergencyCall.doctor = providerId;
                    //                 emergencyCall.location = location;
                    //                 emergencyCall.date = date;
                    //
                    //                 emergencyCall.save(function (err, provider) {
                    //                     if (err) {
                    //                         res.send(err)
                    //                     } else {
                    //                         user.notification.push({
                    //                             "type": "OnCall",
                    //                             "event": provider._id,
                    //                             "text": doctorName+", your new on call schedule is now available.",
                    //                             "doctorId":providerId
                    //                         });
                    //                         user.save(function (err, data) {
                    //                             if (err) {
                    //                                 res.send(err)
                    //                             }
                    //                         })
                    //                     }
                    //                 })
                    //             }
                    //
                    //         })
                    //     }
                    //
                    //     res.send({status: true, info: "Successfully Added"});
                    // })
                        .put(function (req, res) {
                            OnCall.remove({_id: req.body.id}, function (err, data) {
                                if (err) {
                                    res.send({status: "error", "error": err})
                                } else {
                                    res.send(data);
                                }
                            })
                        })
                    router.get('/profile/:id', function (req, res, next) {
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

                    router.post('/manage/profile/:id', function (req, res, next) {
                        if (req.isAdmin) {
                            Doctor.findById(req.params.id, function (err, doctor) {
                                if (err) {
                                    res.send(err)
                                } else {
                                    doctor.username = req.body.username;
                                    doctor.save(function (err, doctor) {
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
                                res.send({status: false, info: err});
                            } else {
                                doc.Appointment.push({
                                    "location": req.body.location,
                                    "appointmentTime": req.body.appointmentTime,
                                    "description": req.body.description,
                                    "appointmentType": req.body.appointmentType,
                                })
                                doc.save(function (err, data) {
                                    if (err) {
                                        res.send(err)
                                    } else {
                                        Location.find({location:req.body.location}, function (err, loc) {
                                            if (err){
                                                console.log("err "+err);
                                            }
                                            var location = new Location();
                                            location.location = req.body.location;
                                            location.save(function (err, data) {
                                                if (err) {
                                                    // res.send({status: false, info: err});
                                                }
                                            })
                                        })
                                        res.send({status: true, info: "Appointment saved"});
                                    }
                                })
                            }
                        })
                    })
                    router.put('/rescheduled/appointment/:docId/:appointmentId', function (req, res) {
                        Doctor.findById(req.params.docId, function (err, doc) {
                            if (err) {
                                res.send({status: false, info: err});
                            } else {
                                for (var i = 0; i <= doc.Appointment.length-1; i++) {
                                    if (doc.Appointment[i]._id == req.params.appointmentId) {
                                        doc.Appointment[i].location = req.body.location;
                                        doc.Appointment[i].rescheduledTime = req.body.rescheduledTime;
                                        doc.Appointment[i].appointmentTime = req.body.appointmentTime;
                                        doc.Appointment[i].appointmentType = req.body.appointmentType;
                                        doc.Appointment[i].description = req.body.description;
                                        doc.save(function (err, doctor) {
                                            if (err) {
                                                res.send(res.send({status: false, info: "AppointmentId not saved", err: err}))

                                            } else {
                                                res.send({Status: true, info: "Success"});
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    });
                    module.exports = router;
                // }







