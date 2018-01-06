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
var Location = mongoose.model('Location');
var ensureAuthenticated = require('../authMiddleWare');


router.get('/fetchAllDoctor', function (req, res) {
    Doctor.find({}, function (err, doc) {
        if (err) {
            res.send({status: false, info: "Something is not right"})
        } else {
            res.send({status: true, doctor: doc});
        }
    })
});
router.get('/AllDoctors', function (req, res) {
    Doctor.find({}, function (err, doc) {
        if (err) {
            res.send({status: false, info: "Something is not right"})
        } else {
            var doctor = [];
            _.forEach(doc, function(data){
                doctor.push({"username":data.username,"id":data._id})
            })
            res.send({status: true, doctor:doctor});
        }
    })
});
router.get('/fetch/All/location', function (req, res) {
    Location.find({}, function (err, doc) {
        if (err) {
            res.send({status: false, info: "Something is not right"})
        } else {
            res.send(doc);
        }
    })
});
router.use(ensureAuthenticated);
router.get('/myProfile', function (req, res, next) {
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
    .get(function (req, res) {
        Doctor.findById(req.userId, function (err, user) {
            if (err) {
                res.send(err);
            } else {
                var myMatch = user.following.map(function (ele) {
                    return ele;
                });
                Doctor.find({_id: {$in: myMatch}}, function (err, docs) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.send(docs);
                    }
                });
            }
        });
    });
router.route('/following')
    .get(function (req, res) {
        Doctor.findById(req.userId, function (err, user) {
            if (err)
                res.send(err);

            var myMatch = user.follow.map(function (ele) {
                return ele;
            });
            Doctor.find({_id: {$in: myMatch}}, function (err, docs) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(docs);
                }
            });
        });
    });
router.post('/getAppointmentByDoctor', function (req, res) {
    Doctor.findById(req.body.id, function (err, doc) {
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
});
router.route('/follow/doctor')
    .post(function (req, res) {
        Doctor.findById(req.userId, function (err, doc) {
            if (err) {
                res.send({status: false, info: err});
            }
            else {
                if (doc.follow.indexOf(req.body.id) < 0) {
                    doc.follow.push(req.body.id);
                    doc.save(function (err, doctor) {
                        if (err) {
                            res.send({status: false, info: err})
                        } else {
                            Doctor.findById(req.body.id, function (err, doctor) {
                                if (err) {
                                    res.send({status: false, info: err})
                                } else {
                                    if (doc.follow.indexOf(req.userId) < 0) {
                                        doctor.following.push(req.userId);
                                        doctor.notification.push({
                                            'type': 'following',
                                            "text": "Dr." + doc.username + " now following you",
                                            "doctorId": doc._id
                                        })
                                        doctor.save(function (err, doctor) {
                                            if (err) {
                                                res.send({status: false, info: err})
                                            } else {

                                                res.send({status: true, info: "Success"})
                                            }
                                        })
                                    } else {
                                        res.send({status: false, info: "Already Member"});
                                    }
                                }
                            })
                        }
                    })
                } else {
                    res.send({status: false, info: "Already Member"});
                }
            }
        })
    });
router.post('/unFollow/doctor', function (req, res) {
    Doctor.findById(req.userId, function (err, doc) {
        if (err) {
            res.send({status: false, info: err});
        } else {
            var index = doc.follow.map(function (doctor, index) {
                if (doctor === req.body.id) {
                    return index;
                }
            });
            doc.follow.splice(index, 1);
            doc.save(function (err, doctor) {
                if (err) {
                    res.send({status: false, info: err})
                } else {
                    Doctor.findById(req.body.id, function (err, doctor) {
                        if (err) {
                            res.send({status: false, info: err})
                        } else {
                            var index = doctor.following.map(function (doc, index) {
                                if (doc === req.userId) {
                                    return index;
                                }
                            })
                            doctor.following.splice(index, 1);
                            doctor.notification.push({
                                'type': 'unfollow',
                                "text": "Dr."+doc.username + ' UnFollowed you',
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
});
router.route('/onCall/providers')
    .get(function (req, res) {
        OnCall.find({}, function (err, posts) {
            OnCall.populate(posts, {path: 'doctor'}, function (err, posts) {
                if (err) {
                    res.send({status: "error", "error": err})
                } else {
                    var onCallEvents = [];
                    _.forEach(posts, function (provider) {
                        onCallEvents.push({
                            'id': provider._id,
                            'location': provider.location,
                            'doctor': provider.doctor.username,
                            'doctorId': provider.doctor._id,
                            'date': provider.date
                        })
                        return onCallEvents;
                    })
                    res.send(onCallEvents);
                }
            })
        })
    });
router.get('/my/notification', function (req, res) {
    Doctor.findById(req.userId, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            var myNotification = [];
            _.forEach(doc.notification, function (event) {
                if (event.isRead === false) {
                    myNotification.push({'id': event._id, 'type': event.type, 'text': event.text, 'doctorId': event.doctorId});
                }
                return myNotification;
            })
            res.send(myNotification);
        }
    })
});
router.get('/notification/read', function (req, res) {
    Doctor.findById(req.userId, function (err, doc) {
        _.forEach(doc.notification, function (event) {
            event.isRead = true;
        })
        doc.save(function (err, data) {
            if (err) {
                res.send(err)
            } else {
                res.send({status: true, info: "Success"});
            }
        })
    })
});
module.exports = router;
