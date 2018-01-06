angular.module('myApp')
    .controller('eventEditCtrl', ['SweetAlert', '$rootScope', '$scope', '$filter', '$http', 'NgTableParams', 'SERVER_BASE_URL', 'UtilityService',
        function (SweetAlert, $rootScope, $scope, $filter, $http, NgTableParams, SERVER_BASE_URL, UtilityService) {

            $scope.patientEvent = [];
            $scope.ctrl = {};
            $scope.patient = $rootScope.patientDetail;
            if ($scope.patient.rescheduledTime !== undefined) {
                $scope.ctrl.dateFormatted = $scope.patient.rescheduledTime;
            }
            $scope.typeError = false;
            $scope.locationError = false;
            $scope.checkLocAvability = checkLocAvability;
            $scope.checkTypeAvability = checkTypeAvability;
            $scope.isAuthenticate = UtilityService.checkUserLogin();
            $scope.patient.doctorId = UtilityService.getDoctor().id;
            $scope.minDateString = moment().subtract(0, 'day');
            $scope.$emit('editEvent', {selectDoctor: false});

            $scope.locationUrl= 'admin/doctor/fetch/All/location';
            $scope.typeUrl= 'admin/doctor/fetch/All/type';

            UtilityService.apiGet($scope.locationUrl,{}).then(function(response){
                states = response.data.map(function(loc){
                    return loc.location;
                })
            });
            UtilityService.apiGet($scope.typeUrl,{}).then(function(response){
                types = response.data.filter(function(elem, index, self) {
                    if (elem != null) {
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
                        results.push({ label: state, value: state });
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
                    var state = types[i];
                    if (state.toLowerCase().indexOf(q) === 0)
                        results.push({ label: state, value: state });
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
            $scope.Update = function () {
                $scope.patient.rescheduledTime = $scope.ctrl.dateFormatted;
                SweetAlert.swal({
                        title: "Are you sure?",
                        text: "Do you want to save the data?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, save it!",
                        cancelButtonText: "No, cancel it!",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            $http({
                                method: 'PUT',
                                isArray: false,
                                url: SERVER_BASE_URL + 'admin/doctor/rescheduled/appointment/' + $scope.patient.doctorId + '/' + $scope.patient.appointmentId,
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + localStorage.getItem("ngStorage-token")
                                },
                                data: $scope.patient
                            }).then(function (response) {
                                if (response.status) {
                                    SweetAlert.swal("Saved!", "Your data has been saved.", "success");
                                    $scope.patient = {};
                                    $scope.ctrl.dateFormatted = '';
                                } else {
                                    SweetAlert.swal("Cancelled", response.info, "Done");
                                }
                            })
                        } else {
                            SweetAlert.swal("Cancelled!", "Your data is temporarily in the table");
                        }
                    })
            }

        }]);
