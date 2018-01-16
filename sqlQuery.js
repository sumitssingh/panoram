var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var _ = require('underscore');
var cron = require('node-cron');
var url = 'mongodb://107.170.218.205:27017/panoProd';

    var sql = require("mssql");;
    var config = {
        user: 'svc_oncall',
        password: 'gOGJhG6K1w',
        server: 'xposc-nextgen01', 
        database: 'NGProd'
    };
 

cron.schedule('20 44 23 * * *', function(){
  // console.log("date");
  // var today = new Date();
  var d = new Date();
var n = d.toJSON();
var date  = n.split('T');
var date1 = date[0].split('-');
var newDate = date1[0]+date1[1]+date1[2];
    // var dd = today.getDate();
  // var date = new Date().format('ddmmyy');
  // var date1 = parseInt(today);
  console.log(newDate);

    sql.connect(config, function (err) {
    
        if (err) console.log('err '+err);
        var request = new sql.Request();
           console.log("connected");
           request.query("select * from viewDrCardCategories where working_date=newDate union select * from viewDrCardClinicLocations where working_date=newDate union select * from viewDrCardAppointments where working_date='newDate' order by description, begintime", function (err, recordset) {
            if (err)  {
                console.log(err)
            }
            MongoClient.connect(url, function(err, db) {
              assert.equal(null, err);
              console.log("Connected successfully to server");
                var event = recordset;
                request.query("select distinct description from viewDrCardCategories", function (err, data) {
                    if (err) {
                        console.log(err)
                    }
                    var newData = [];
                for (var i =0; i<data.recordset.length-1;i++) {
                    newData.push({"username":data.recordset[i].description,"Appointment":[]});
                    for (var j= 0;j<event.recordset.length-1;j++) {
                        if (event.recordset[j].description === data.recordset[i].description) {
                              var year = event.recordset[j].working_date.slice(0,4);
                              var month = event.recordset[j].working_date.slice(4,6);
                              var day = event.recordset[j].working_date.slice(6,8);
                              if (event.recordset[j].begintime!=null) {
                                 var hr = event.recordset[j].begintime.slice(0,2);
                              var min = event.recordset[j].begintime.slice(2,4);
                              }
                              var time = month+'-'+day+'-'+year+' '+hr+':'+min;
                              var date = new Date(time);
                              var appointmenTime = date.toDateString() + ' ' +hr+':'+min;
                            newData[i].Appointment.push({'appointmenTime': appointmenTime, 'location': event.recordset[j].Location,appointmentType:event.recordset[j].Event,description:event.recordset[j].Details})
                        }
                    }
                }
                _.forEach(newData,function(list) {
                        var collection = db.collection('doctors');
                                collection.insert({"username":list.username,"Appointment":list.Appointment}, function(err, result) {
                            if (err) {
                                console.log(err)
                            }else {
                                console.log(result);
                            }
                        })
                })
                request.query("select distinct Location from viewDrCardClinicLocations", function (err, location) {
                     if (err) {
                        console.log(err)
                    }
                     _.forEach(location.recordset,function(list) {
                        var collection = db.collection('locations');
                                collection.insert({location:list.Location}, function(err, result) {
                            if (err) {
                                console.log(err)
                            }else {
                                console.log(result);
                            }
                        })
                })
                db.close();
            })
        })        
    })   
})     
})     

    });
   // var appointment  = [];
   //              var appointmenTime = data.working_date + ' ' + data.begintime;
   //              appointment.push({'appointmenTime': appointmenTime, 'location': data.Location})
   //                  var collection = db.collection('doctors');
   //                       collection.insert({"username":data.description,"Appointment":appointment}, function(err, result) {
   //                          if (err) {
   //                              console.log(err)
   //                          }else {
   //                              console.log(result);
   //                          }
   //                      })
   //                       db.close();
                
   //              request.query("select distinct description from viewDrCardCategories", function (err, data) {
   //                      if (err) {
   //                          console.log(err)
   //                      } else {
   //                          for (var i = data.length - 1; i >= 0; i--) {

   //                          var collection = db.collection('doctors');
   //                          collection.find({username:data.description}, function(err, doc){
   //                              _.forEach(doc, function(data){
   //                                  var appointment  = [];
   //                                  appointment = data.Appointment;
   //                                  collection.insert({"username":doc.username+1,"Appointment":appointment}, function(err, result) {
   //                                  if (err) {
   //                                      console.log(err)
   //                                  }else {
   //                                      console.log(result);
   //                                  }
   //                              })
   //                          })
   //                      })
   //                  }
   //          db.close();
   //          }
   //      })
// console.log(newData);

        // });
            // })
    // });



