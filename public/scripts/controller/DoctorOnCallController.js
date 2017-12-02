angular.module('myApp')
.controller('OnCallCtrl',['$scope','$rootScope', '$sce', '$q','$http','SweetAlert','NgTableParams','SERVER_BASE_URL','UtilityService','socket','onCallService',
  function ($scope,$rootScope, $sce,  $q,  $http, SweetAlert, NgTableParams, SERVER_BASE_URL, UtilityService,socket,onCallService){

$scope.loginName=localStorage.getItem('ngStorage-loginName');
$scope.loginName = $scope.loginName.replace(/"/g,"");
$scope.row = {};
$scope.OnCall  = [];
var id =[]
var states = [];
$scope.isAuthenticate = UtilityService.checkUserLogin();
$scope.locationUrl= 'admin/doctor/fetch/All/location';


socket.on('connect', function () { 
// alert("connected");
});

                        $http({
                            method: "GET",
                            url: SERVER_BASE_URL+'admin/doctor/getAllDoctors/name',
                            headers:{
                                'content-type':'Application/json',
                                'Authorization':"Bearer " + localStorage.getItem('ngStorage-token')
                            }
                        }).then(function (response) {
                            console.log(response);
                            $scope.response = response.data.doctor;
                            var doctor = response.data.doctor.map(function(doc){
                              return doc.name;
                            })
                            console.log(doctor);
                           UtilityService.apiGet($scope.locationUrl,{}).then(function(response){
                             states = response.data.filter(function(elem, index, self) {
<<<<<<< HEAD
                if (elem != null) {
                    return index == self.indexOf(elem);
                }
             })
=======
          			if (elem != null) {
            				return index == self.indexOf(elem);
          			}
       			 })
>>>>>>> d534f2c08f092078956263c565c060ab2164d096
                          });
                              function suggest_state(term) {
                                console.log(term);
                            var q = term.toLowerCase().trim();
                            var results = [];

                            // Find first 10 states that start with `term`.
                            for (var i = 0; i < states.length && results.length < 10; i++) {
                              var state = states[i];
                              if (state.toLowerCase().indexOf(q) === 0)
                                results.push({ label: state, value: state });
                            }

                            return results;
                          }

                          $scope.autocomplete_location = {
                            suggest: suggest_state
                          };
                          function suggest_doctor(term) {
                            console.log(term);
                            var q = term.toLowerCase().trim();
                            var results = [];

                            // Find first 10 states that start with `term`.
                            for (var i = 0; i < doctor.length && results.length < 10; i++) {
                              var name = doctor[i];
                              if (name.toLowerCase().indexOf(q) === 0)
                                results.push({ label: name, value: name });
                            }

                            return results;
                          }

                          $scope.autocomplete_options = {
                            suggest: suggest_doctor
                          };

                    });


    $scope.Save=function(){
     
                     SweetAlert.swal({
                     title: "Are you sure?",
                     text: "Do you want to save the data?",
                     type: "warning",
                     showCancelButton: true,
                     confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, save it!",
                     cancelButtonText: "No, cancel it!",
                     closeOnConfirm: false,
                     closeOnCancel: false }, 
              function(isConfirm){ 
            if (isConfirm) {
              console.log($scope.OnCall);
              
                              var to = "59f735c95a3a99017e0d2189";
                              var message ="New OnCall events"
                              var from = "59f733f45a3a99017e0d2188"
                              socket.emit('sendEvents', id);
                              console.log(id);
                   $http({
                            method: "POST",
                            url: SERVER_BASE_URL+'admin/doctor/onCall/providers',
                            headers:{
                                'content-type':'Application/json',
                                'Authorization':"Bearer " + localStorage.getItem('ngStorage-token')
                            },
                            data: $scope.OnCall
                        }).then(function (response) {
                          
                            for (var i = id.length - 1; i >= 0; i--) {
                              console.log(id[i]);
                              var to = "59f735c95a3a99017e0d2189";
                              var message ="New OnCall events"
                              var from = "59f733f45a3a99017e0d2188"
                              socket.emit('add-message', message, to, from);
                            }

                    SweetAlert.swal("Saved!", "Your data has been saved.", "success");
              })
            }   else {
                    SweetAlert.swal("Cancelled!", "Your data is temporarily in the table");
                  }
              })
    }
  var self = this;
        onCallService.query(function(response){
                  console.log(response);
//                  console.log(response[0].doctor.username);
          // $scope.loading = false;
          $scope.people=response.data;
          var data=[];
          var people=[];
          data=response;
console.log(data);
              for(var i=0;i<data.length;i++) {
                console.log(data[i].doctor.username);
                      people.push({"id":data[i]._id,"doctor":data[i].doctor.username, "location":data[i].location, "time":data[i].date});
              }
console.log(people);
        var originalData = angular.copy(people);


                  self.tableParams = new NgTableParams({}, {
            dataset: angular.copy(people)
          });
    self.deleteCount = 0;

    self.add = add;
    self.cancelChanges = cancelChanges;
    self.del = del;
    self.hasChanges = hasChanges;
    self.saveChanges = saveChanges;

    //////////

    function add() {
      self.isEditing = true;
      self.isAdding = true;
      self.tableParams.settings().dataset.unshift({
        doctor: "",
        location: null,
        time: null
      });

      self.tableParams.sorting({});
      self.tableParams.page(1);
      self.tableParams.reload();
    }

    function cancelChanges() {
      resetTableStatus();
      var currentPage = self.tableParams.page();
      self.tableParams.settings({
        dataset: angular.copy(originalData)
      });
      // keep the user on the current page when we can
      if (!self.isAdding) {
        self.tableParams.page(currentPage);
      }
    }

    function del(row) {
      console.log(row);
                     SweetAlert.swal({
                     title: "Are you sure?",
                     text: "Do you really want to delete the data?",
                     type: "warning",
                     showCancelButton: true,
                     confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
                     cancelButtonText: "No, cancel it!",
                     closeOnConfirm: false,
                     closeOnCancel: false }, 
              function(isConfirm){ 
            if (isConfirm) {
                   $http({
                            method: "PUT",
                            url: SERVER_BASE_URL+'admin/doctor/onCall/providers',
                            headers:{
                                'content-type':'Application/json',
                                'Authorization':"Bearer " + localStorage.getItem('ngStorage-token')
                            },
                            data: row
                        }).then(function (response) {
                          
                    SweetAlert.swal("Saved!", "Your data has been removed.", "success");
              })
                    // window.location=('#/customer').replace();
            }   else {
                    SweetAlert.swal("Cancelled!", "Your data is safe");
                  }
              })
      _.remove(self.tableParams.settings().dataset, function(item) {
        return row === item;
      });
      self.deleteCount++;
      self.tableTracker.untrack(row);
      self.tableParams.reload().then(function(data) {
        if (data.length === 0 && self.tableParams.total() > 0) {
          self.tableParams.page(self.tableParams.page() - 1);
          self.tableParams.reload();
        }
      });
    }

    function hasChanges() {
      return self.tableForm.$dirty || self.deleteCount > 0
    }

    function resetTableStatus() {
      self.isEditing = false;
      self.isAdding = false;
      self.deleteCount = 0;
      self.tableTracker.reset();
      self.tableForm.$setPristine();
    }

    function saveChanges() {
      resetTableStatus();
      var currentPage = self.tableParams.page();
      originalData = angular.copy(self.tableParams.settings().dataset);
        data=originalData;
        console.log(data[0]);
        // socket.emit('adduser', data[0]);
        $scope.OnCall.push(data[0]);

                  for (var i = $scope.response.length - 1; i >= 0; i--) {
                    for (var j = $scope.OnCall.length - 1; j >= 0; j--) {
                      if ($scope.OnCall[j].doctor ===$scope.response[i].name ) {
                        id.push($scope.response[i].id);
                        console.log($scope.response[i].id);
                              socket.emit('adduser', id[j]);

                      }
                    }
                  }
    }
  })
        // }

}]);


(function() {
  "use strict";

  angular.module("myApp").run(configureDefaults);
  configureDefaults.$inject = ["ngTableDefaults"];

  function configureDefaults(ngTableDefaults) {
    ngTableDefaults.params.count = 5;
    ngTableDefaults.settings.counts = [];
  }
})();

(function() {
  angular.module("myApp").directive("demoTrackedTable", demoTrackedTable);

  demoTrackedTable.$inject = [];

  function demoTrackedTable() {
    return {
      restrict: "A",
      priority: -1,
      require: "ngForm",
      controller: demoTrackedTableController
    };
  }

  demoTrackedTableController.$inject = ["$scope", "$parse", "$attrs", "$element"];

  function demoTrackedTableController($scope, $parse, $attrs, $element) {
    var self = this;
    var tableForm = $element.controller("form");
    var dirtyCellsByRow = [];
    var invalidCellsByRow = [];

    init();

    ////////

    function init() {
      var setter = $parse($attrs.demoTrackedTable).assign;
      setter($scope, self);
      $scope.$on("$destroy", function() {
        setter(null);
      });

      self.reset = reset;
      self.isCellDirty = isCellDirty;
      self.setCellDirty = setCellDirty;
      self.setCellInvalid = setCellInvalid;
      self.untrack = untrack;
    }

    function getCellsForRow(row, cellsByRow) {
      return _.find(cellsByRow, function(entry) {
        return entry.row === row;
      })
    }

    function isCellDirty(row, cell) {
      var rowCells = getCellsForRow(row, dirtyCellsByRow);
      return rowCells && rowCells.cells.indexOf(cell) !== -1;
    }

    function reset() {
      dirtyCellsByRow = [];
      invalidCellsByRow = [];
      setInvalid(false);
    }

    function setCellDirty(row, cell, isDirty) {
      setCellStatus(row, cell, isDirty, dirtyCellsByRow);
    }

    function setCellInvalid(row, cell, isInvalid) {
      setCellStatus(row, cell, isInvalid, invalidCellsByRow);
      setInvalid(invalidCellsByRow.length > 0);
    }

    function setCellStatus(row, cell, value, cellsByRow) {
      var rowCells = getCellsForRow(row, cellsByRow);
      if (!rowCells && !value) {
        return;
      }

      if (value) {
        if (!rowCells) {
          rowCells = {
            row: row,
            cells: []
          };
          cellsByRow.push(rowCells);
        }
        if (rowCells.cells.indexOf(cell) === -1) {
          rowCells.cells.push(cell);
        }
      } else {
        _.remove(rowCells.cells, function(item) {
          return cell === item;
        });
        if (rowCells.cells.length === 0) {
          _.remove(cellsByRow, function(item) {
            return rowCells === item;
          });
        }
      }
    }

    function setInvalid(isInvalid) {
      self.$invalid = isInvalid;
      self.$valid = !isInvalid;
    }

    function untrack(row) {
      _.remove(invalidCellsByRow, function(item) {
        return item.row === row;
      });
      _.remove(dirtyCellsByRow, function(item) {
        return item.row === row;
      });
      setInvalid(invalidCellsByRow.length > 0);
    }
  }
})();

(function() {
  angular.module("myApp").directive("demoTrackedTableRow", demoTrackedTableRow);

  demoTrackedTableRow.$inject = [];

  function demoTrackedTableRow() {
    return {
      restrict: "A",
      priority: -1,
      require: ["^demoTrackedTable", "ngForm"],
      controller: demoTrackedTableRowController
    };
  }

  demoTrackedTableRowController.$inject = ["$attrs", "$element", "$parse", "$scope"];

  function demoTrackedTableRowController($attrs, $element, $parse, $scope) {
    var self = this;
    var row = $parse($attrs.demoTrackedTableRow)($scope);
    var rowFormCtrl = $element.controller("form");
    var trackedTableCtrl = $element.controller("demoTrackedTable");

    self.isCellDirty = isCellDirty;
    self.setCellDirty = setCellDirty;
    self.setCellInvalid = setCellInvalid;

    function isCellDirty(cell) {
      return trackedTableCtrl.isCellDirty(row, cell);
    }

    function setCellDirty(cell, isDirty) {
      trackedTableCtrl.setCellDirty(row, cell, isDirty)
    }

    function setCellInvalid(cell, isInvalid) {
      trackedTableCtrl.setCellInvalid(row, cell, isInvalid)
    }
  }
})();

(function() {
  angular.module("myApp").directive("demoTrackedTableCell", demoTrackedTableCell);

  demoTrackedTableCell.$inject = [];

  function demoTrackedTableCell() {
    return {
      restrict: "A",
      priority: -1,
      scope: true,
      require: ["^demoTrackedTableRow", "ngForm"],
      controller: demoTrackedTableCellController
    };
  }

  demoTrackedTableCellController.$inject = ["$attrs", "$element", "$scope"];

  function demoTrackedTableCellController($attrs, $element, $scope) {
    var self = this;
    var cellFormCtrl = $element.controller("form");
    var cellName = cellFormCtrl.$name;
    var trackedTableRowCtrl = $element.controller("demoTrackedTableRow");

    if (trackedTableRowCtrl.isCellDirty(cellName)) {
      cellFormCtrl.$setDirty();
    } else {
      cellFormCtrl.$setPristine();
    }

    $scope.$watch(function() {
      return cellFormCtrl.$dirty;
    }, function(newValue, oldValue) {
      if (newValue === oldValue) return;

      trackedTableRowCtrl.setCellDirty(cellName, newValue);
    });

    $scope.$watch(function() {
      return cellFormCtrl.$invalid;
    }, function(newValue, oldValue) {
      if (newValue === oldValue) return;

      trackedTableRowCtrl.setCellInvalid(cellName, newValue);
    });
  }
})();









// angular.module('myApp')
// .controller('OnCallCtrl',['$scope','$rootScope', '$sce', '$q','$http','SweetAlert','NgTableParams',
//   function ($scope,$rootScope, $sce,  $q,  $http, SweetAlert, NgTableParams){
//   // var simpleList = [{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"}];

// $scope.row = {};
// $scope.OnCall  = [];
// var data = [];

//                               $http({
//                             method: "GET",
//                             url: SERVER_BASE_URL+'admin/doctor/onCall/providers',
//                             headers:{
//                                 'content-type':'Application/json',
//                                 'Authorization':"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJleHAiOjMwMjM1NjIwMywiaWF0IjoxNTA2NTk3MDE5fQ.ijDTib7qCuoQ0_MH33sV-Yu2Tf0VcDianhyyZWS-8R8"
//                             }
//                         }).then(function (response) {
//                             // console.log(response);
//                             $scope.response = response.data;
//                             var location = $scope.response.map(function(doc){
//                               return doc.location;
//                             })

//                            for (var i = $scope.response.length - 1; i >= 0; i--) {
//                                 data.push({"doctor": $scope.response[i].doctor.username, "location": $scope.response[i].location, "time": $scope.response[i].date});
//                               }
//                               console.log(data);



//                         $http({
//                             method: "GET",
//                             url: SERVER_BASE_URL+'admin/doctor/getAllDoctors/name',
//                             headers:{
//                                 'content-type':'Application/json',
//                                 'Authorization':"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJleHAiOjMwMjM1NjIwMywiaWF0IjoxNTA2NTk3MDE5fQ.ijDTib7qCuoQ0_MH33sV-Yu2Tf0VcDianhyyZWS-8R8"
//                             }
//                         }).then(function (response) {
//                             // console.log(response);
//                             $scope.response = response.data.doctor;
//                             var doctor = response.data.doctor.map(function(doc){
//                               return doc.name;
//                             })
//                           // var simpleList = [{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"}];
//                           var states = location;

//                               function suggest_state(term) {
//                                 // console.log(term);
//                             var q = term.toLowerCase().trim();
//                             var results = [];

//                             // Find first 10 states that start with `term`.
//                             for (var i = 0; i < states.length && results.length < 10; i++) {
//                               var state = states[i];
//                               if (state.toLowerCase().indexOf(q) === 0)
//                                 results.push({ label: state, value: state });
//                             }

//                             return results;
//                           }

//                           $scope.autocomplete_location = {
//                             suggest: suggest_state
//                           };
//                           function suggest_doctor(term) {
//                             // console.log(term);
//                             var q = term.toLowerCase().trim();
//                             var results = [];

//                             // Find first 10 states that start with `term`.
//                             for (var i = 0; i < doctor.length && results.length < 10; i++) {
//                               var name = doctor[i];
//                               if (name.toLowerCase().indexOf(q) === 0)
//                                 results.push({ label: name, value: name });
//                             }

//                             return results;
//                           }

//                           $scope.autocomplete_options = {
//                             suggest: suggest_doctor
//                           };

//                     });


//     $scope.Save=function(){

//                      SweetAlert.swal({
//                      title: "Are you sure?",
//                      text: "Do you want to save the data?",
//                      type: "warning",
//                      showCancelButton: true,
//                      confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, save it!",
//                      cancelButtonText: "No, cancel it!",
//                      closeOnConfirm: false,
//                      closeOnCancel: false }, 
//               function(isConfirm){ 
//             if (isConfirm) {
//               // console.log($scope.OnCall);
//                    $http({
//                             method: "POST",
//                             url: SERVER_BASE_URL+'admin/doctor/onCall/providers',
//                             headers:{
//                                 'content-type':'Application/json',
//                                 'Authorization':"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJleHAiOjMwMjM1NjIwMywiaWF0IjoxNTA2NTk3MDE5fQ.ijDTib7qCuoQ0_MH33sV-Yu2Tf0VcDianhyyZWS-8R8"
//                             },
//                             data: $scope.OnCall
//                         }).then(function (response) {

// })
//                     SweetAlert.swal("Saved!", "Your data has been saved.", "success");
//                     // window.location=('#/customer').replace();
//             }   else {
//                     SweetAlert.swal("Cancelled!", "Your data is temporarily in the table");
//                   }
//               })
//     }
// // var simpleList = [{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"},{doctor: "John Doe", location: "usa", time: "oct/12/2017"}];
// var simpleList =data;
// console.log(simpleList);
//   var self = this;

//     var originalData = angular.copy(simpleList);

//     self.tableParams = new NgTableParams({}, {
//       dataset: angular.copy(simpleList)
//     });

//     self.deleteCount = 0;

//     self.add = add;
//     self.cancelChanges = cancelChanges;
//     self.del = del;
//     self.hasChanges = hasChanges;
//     self.saveChanges = saveChanges;

//     //////////

//     function add() {
//       self.isEditing = true;
//       self.isAdding = true;
//       self.tableParams.settings().dataset.unshift({
//         doctor: "",
//         location: null,
//         time: null
//       });

//       self.tableParams.sorting({});
//       self.tableParams.page(1);
//       self.tableParams.reload();
//     }

//     function cancelChanges() {
//       resetTableStatus();
//       var currentPage = self.tableParams.page();
//       self.tableParams.settings({
//         dataset: angular.copy(originalData)
//       });
//       // keep the user on the current page when we can
//       if (!self.isAdding) {
//         self.tableParams.page(currentPage);
//       }
//     }

//     function del(row) {
//       _.remove(self.tableParams.settings().dataset, function(item) {
//         return row === item;
//       });
//       self.deleteCount++;
//       self.tableTracker.untrack(row);
//       self.tableParams.reload().then(function(data) {
//         if (data.length === 0 && self.tableParams.total() > 0) {
//           self.tableParams.page(self.tableParams.page() - 1);
//           self.tableParams.reload();
//         }
//       });
//     }

//     function hasChanges() {
//       return self.tableForm.$dirty || self.deleteCount > 0
//     }

//     function resetTableStatus() {
//       self.isEditing = false;
//       self.isAdding = false;
//       self.deleteCount = 0;
//       self.tableTracker.reset();
//       self.tableForm.$setPristine();
//     }

//     function saveChanges() {
//       resetTableStatus();
//       var currentPage = self.tableParams.page();
//       originalData = angular.copy(self.tableParams.settings().dataset);
//         data=originalData;
//         $scope.OnCall.push(data[0]);
//     }
//   })
//         // }

// }]);


// (function() {
//   "use strict";

//   angular.module("myApp").run(configureDefaults);
//   configureDefaults.$inject = ["ngTableDefaults"];

//   function configureDefaults(ngTableDefaults) {
//     ngTableDefaults.params.count = 5;
//     ngTableDefaults.settings.counts = [];
//   }
// })();

// (function() {
//   angular.module("myApp").directive("demoTrackedTable", demoTrackedTable);

//   demoTrackedTable.$inject = [];

//   function demoTrackedTable() {
//     return {
//       restrict: "A",
//       priority: -1,
//       require: "ngForm",
//       controller: demoTrackedTableController
//     };
//   }

//   demoTrackedTableController.$inject = ["$scope", "$parse", "$attrs", "$element"];

//   function demoTrackedTableController($scope, $parse, $attrs, $element) {
//     var self = this;
//     var tableForm = $element.controller("form");
//     var dirtyCellsByRow = [];
//     var invalidCellsByRow = [];

//     init();

//     ////////

//     function init() {
//       var setter = $parse($attrs.demoTrackedTable).assign;
//       setter($scope, self);
//       $scope.$on("$destroy", function() {
//         setter(null);
//       });

//       self.reset = reset;
//       self.isCellDirty = isCellDirty;
//       self.setCellDirty = setCellDirty;
//       self.setCellInvalid = setCellInvalid;
//       self.untrack = untrack;
//     }

//     function getCellsForRow(row, cellsByRow) {
//       return _.find(cellsByRow, function(entry) {
//         return entry.row === row;
//       })
//     }

//     function isCellDirty(row, cell) {
//       var rowCells = getCellsForRow(row, dirtyCellsByRow);
//       return rowCells && rowCells.cells.indexOf(cell) !== -1;
//     }

//     function reset() {
//       dirtyCellsByRow = [];
//       invalidCellsByRow = [];
//       setInvalid(false);
//     }

//     function setCellDirty(row, cell, isDirty) {
//       setCellStatus(row, cell, isDirty, dirtyCellsByRow);
//     }

//     function setCellInvalid(row, cell, isInvalid) {
//       setCellStatus(row, cell, isInvalid, invalidCellsByRow);
//       setInvalid(invalidCellsByRow.length > 0);
//     }

//     function setCellStatus(row, cell, value, cellsByRow) {
//       var rowCells = getCellsForRow(row, cellsByRow);
//       if (!rowCells && !value) {
//         return;
//       }

//       if (value) {
//         if (!rowCells) {
//           rowCells = {
//             row: row,
//             cells: []
//           };
//           cellsByRow.push(rowCells);
//         }
//         if (rowCells.cells.indexOf(cell) === -1) {
//           rowCells.cells.push(cell);
//         }
//       } else {
//         _.remove(rowCells.cells, function(item) {
//           return cell === item;
//         });
//         if (rowCells.cells.length === 0) {
//           _.remove(cellsByRow, function(item) {
//             return rowCells === item;
//           });
//         }
//       }
//     }

//     function setInvalid(isInvalid) {
//       self.$invalid = isInvalid;
//       self.$valid = !isInvalid;
//     }

//     function untrack(row) {
//       _.remove(invalidCellsByRow, function(item) {
//         return item.row === row;
//       });
//       _.remove(dirtyCellsByRow, function(item) {
//         return item.row === row;
//       });
//       setInvalid(invalidCellsByRow.length > 0);
//     }
//   }
// })();

// (function() {
//   angular.module("myApp").directive("demoTrackedTableRow", demoTrackedTableRow);

//   demoTrackedTableRow.$inject = [];

//   function demoTrackedTableRow() {
//     return {
//       restrict: "A",
//       priority: -1,
//       require: ["^demoTrackedTable", "ngForm"],
//       controller: demoTrackedTableRowController
//     };
//   }

//   demoTrackedTableRowController.$inject = ["$attrs", "$element", "$parse", "$scope"];

//   function demoTrackedTableRowController($attrs, $element, $parse, $scope) {
//     var self = this;
//     var row = $parse($attrs.demoTrackedTableRow)($scope);
//     var rowFormCtrl = $element.controller("form");
//     var trackedTableCtrl = $element.controller("demoTrackedTable");

//     self.isCellDirty = isCellDirty;
//     self.setCellDirty = setCellDirty;
//     self.setCellInvalid = setCellInvalid;

//     function isCellDirty(cell) {
//       return trackedTableCtrl.isCellDirty(row, cell);
//     }

//     function setCellDirty(cell, isDirty) {
//       trackedTableCtrl.setCellDirty(row, cell, isDirty)
//     }

//     function setCellInvalid(cell, isInvalid) {
//       trackedTableCtrl.setCellInvalid(row, cell, isInvalid)
//     }
//   }
// })();

// (function() {
//   angular.module("myApp").directive("demoTrackedTableCell", demoTrackedTableCell);

//   demoTrackedTableCell.$inject = [];

//   function demoTrackedTableCell() {
//     return {
//       restrict: "A",
//       priority: -1,
//       scope: true,
//       require: ["^demoTrackedTableRow", "ngForm"],
//       controller: demoTrackedTableCellController
//     };
//   }

//   demoTrackedTableCellController.$inject = ["$attrs", "$element", "$scope"];

//   function demoTrackedTableCellController($attrs, $element, $scope) {
//     var self = this;
//     var cellFormCtrl = $element.controller("form");
//     var cellName = cellFormCtrl.$name;
//     var trackedTableRowCtrl = $element.controller("demoTrackedTableRow");

//     if (trackedTableRowCtrl.isCellDirty(cellName)) {
//       cellFormCtrl.$setDirty();
//     } else {
//       cellFormCtrl.$setPristine();
//     }

//     $scope.$watch(function() {
//       return cellFormCtrl.$dirty;
//     }, function(newValue, oldValue) {
//       if (newValue === oldValue) return;

//       trackedTableRowCtrl.setCellDirty(cellName, newValue);
//     });

//     $scope.$watch(function() {
//       return cellFormCtrl.$invalid;
//     }, function(newValue, oldValue) {
//       if (newValue === oldValue) return;

//       trackedTableRowCtrl.setCellInvalid(cellName, newValue);
//     });
//   }
// })();



