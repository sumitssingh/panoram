angular.module('myApp')
    .controller('createEventCtrl', ['SweetAlert','$rootScope','$state','$scope','$filter','$http','SERVER_BASE_URL','UtilityService',
        function (SweetAlert,$rootScope,$state,$scope, $filter, $http, SERVER_BASE_URL, UtilityService) {

                $scope.patient = {};
                $scope.patient.appointmentTime = $rootScope.date;
                $scope.patient.status = "active";
                $scope.isAuthenticate = UtilityService.checkUserLogin();

                $scope.createAppointmentUrl= 'admin/doctor/create/appointment/';
                $scope.locationUrl= 'admin/doctor/fetch/All/location';

                $scope.$on('docId', function(event, data){
                    $scope.patient.doctorId = data.id;
                })
                $scope.data = [];   
                $scope.patient.doctorId = UtilityService.getDoctor().id;
                UtilityService.apiGet($scope.locationUrl,{}).then(function(response){
                     states = response.data.map(function(loc){
                              return loc.location;
                            })
                             // states = response.data.filter(function(elem, index, self) {
                             //    if (elem != null) {
                             //        return index == self.indexOf(elem);
                             //    }
                             // })
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
                $scope.create = function() {
                    SweetAlert.swal({
                     title: "Are you sure?",
                     text: "Do you want to save the data?",
                     type: "warning",
                     showCancelButton: true,
                     confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, save it!",
                     cancelButtonText: "No, cancel it!",
                     closeOnConfirm: true,
                     closeOnCancel: true }, 
                function(isConfirm){ 
                    if (isConfirm) {
                        $http({
                            method: "POST",
                            url: SERVER_BASE_URL+$scope.createAppointmentUrl+$scope.patient.doctorId,
                            headers:{
                                'content-type':'Application/json',
                                'Authorization':"Bearer " + localStorage.getItem('ngStorage-token')
                            },
                            data: $scope.patient
                        }).then(function (response) {
                            if (response.status) {
                                $scope.patient = {};
                                SweetAlert.swal("Saved!", "Your data has been saved.", "success");
                            } else {
                                SweetAlert.swal("Cancelled", response.info, "Done");
                            }
                        })
                    }   
                    else {
                        SweetAlert.swal("Cancelled!", "Done");
                    }
                })
            }

        }]);
