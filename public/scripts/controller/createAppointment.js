angular.module('myApp')
    .controller('createEventCtrl', ['SweetAlert','$rootScope','$state','$scope','$filter','$http','SERVER_BASE_URL','UtilityService',
        function (SweetAlert,$rootScope,$state,$scope, $filter, $http, SERVER_BASE_URL, UtilityService) {

                $scope.patient = {};
                $scope.patient.appointmentTime = $rootScope.date;
                $scope.patient.status = "active";
                $scope.isAuthenticate = UtilityService.checkUserLogin();

                $scope.createAppointmentUrl= 'admin/doctor/create/appointment/';

                $scope.$on('docId', function(event, data){
                    $scope.patient.doctorId = data.id;
                })
                $scope.data = [];   
                $scope.patient.doctorId = UtilityService.getDoctor().id;

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
