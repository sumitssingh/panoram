angular.module('myApp')
    .controller('createEventCtrl', ['SweetAlert','$rootScope','$state','$scope','$filter','$timeout','$http','SERVER_BASE_URL','UtilityService',
        function (SweetAlert,$rootScope,$state,$scope, $filter, $timeout, $http, SERVER_BASE_URL, UtilityService) {

            $scope.patient = {};
            $scope.ctrl = {};
            $scope.minDateString = moment().subtract(0, 'day');
            $scope.ctrl.dateFormatted = $rootScope.date.slice(4,40);
            $scope.patient.status = "active";
            $scope.typeError = false;
            $scope.locationError = false;
            $scope.checkLocAvability = checkLocAvability;
            $scope.checkTypeAvability = checkTypeAvability;
            $scope.isAuthenticate = UtilityService.checkUserLogin();
            $scope.createAppointmentUrl = 'admin/doctor/create/appointment/';
            $scope.locationUrl = 'admin/doctor/fetch/All/location';
            $scope.typeUrl = 'admin/doctor/fetch/All/type';

            $scope.$on('docId', function (event, data) {
                $scope.patient.doctorId = data.id;
            })
            $scope.data = [];
            $scope.patient.doctorId = UtilityService.getDoctor().id;
            UtilityService.apiGet($scope.locationUrl, {}).then(function (response) {
                states = response.data.map(function (loc) {
                    return loc.location;
                })
            });
            UtilityService.apiGet($scope.typeUrl, {}).then(function (response) {
                types = response.data.filter(function (elem, index, self) {
                    if (elem && elem != null) {
                        return index == self.indexOf(elem);
                    }
                })
            });

            function suggest_state(term) {
                var q = term.toLowerCase().trim();
                var results = [];
                for (var i = 0; i < states.length && results.length < 10; i++) {
                    var state = states[i];
                    if (state.toLowerCase().indexOf(q) === 0)
                        results.push({label: state, value: state});
                }

                return results;
            }

            $scope.autocomplete_location = {
                suggest: suggest_state
            };

            function suggest_type(term) {
                var q = term.toLowerCase().trim();
                var results = [];
                for (var i = 0; i < types.length && results.length < 10; i++) {
                    var type = types[i];
                    if (type.toLowerCase().indexOf(q) === 0)
                        results.push({label: type, value: type});
                }

                return results;
            }

            $scope.autocomplete_type = {
                suggest: suggest_type
            };
            function checkTypeAvability() {
                if (types.indexOf($scope.patient.appointmentType) < 0) {
                    $scope.typeError = true;
                    $scope.errMsg = "Please Select value from dropdown list only";
                } else {
                    $scope.typeError = false;
                }
            }

            function checkLocAvability() {
                if(states.indexOf($scope.patient.location) <0) {
                    $scope.locationError = true;
                    $scope.errMsg = "Please Select value from dropdown list only";
                } else {
                    $scope.locationError = false;
                }
            }
            $scope.create = function() {
                $scope.patient.appointmentTime = $scope.ctrl.dateFormatted;
                $scope.patient.doctorId = UtilityService.getDoctor().id;
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
                                    $scope.ctrl.dateFormatted = '';
                                    SweetAlert.swal("Saved!", "Your data has been saved.", "success");
                                } else {
                                    SweetAlert.swal("Cancelled", response.info, "Done");
                                }
                            }).catch(function(err) {
                                SweetAlert.swal("Error", "Something is wrong, please try again", "error");
                            });
                        }
                        else {
                            SweetAlert.swal("Cancelled!", "Done");
                        }
                    })
            }

        }]);
