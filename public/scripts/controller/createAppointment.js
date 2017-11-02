angular.module('myApp')
    .controller('createEventCtrl', ['SweetAlert','$rootScope','$scope','$filter','$http','SERVER_BASE_URL','UtilityService',
        function (SweetAlert,$rootScope,$scope, $filter, $http, SERVER_BASE_URL, UtilityService) {

                $scope.patient = {};

                $scope.patient.appointmentTime = $rootScope.date;
                $scope.patient.status = "active";

$scope.data = [];
                
                      $http({
                            method: "GET",
                            url: SERVER_BASE_URL+'admin/doctor/getAllDoctors/name',
                            headers:{
                                'content-type':'Application/json',
                                'Authorization':"Bearer " + localStorage.getItem('ngStorage-token')
                            },
                            data: $scope.OnCall
                        }).then(function (response) {
                            console.log(response.data.doctor);
                         $scope.data=response.data.doctor; 
                         console.log($scope.data);
})






                $scope.create = function() {
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
                   $http({
                            method: "POST",
                            url: SERVER_BASE_URL+'admin/doctor/create/appointment/'+$scope.patient.doctorId,
                            headers:{
                                'content-type':'Application/json',
                                'Authorization':"Bearer " + localStorage.getItem('ngStorage-token')
                            },
                            data: $scope.patient
                        }).then(function (response) {
                          if (response.status) {
                            SweetAlert.swal("Saved!", "Your data has been saved.", "success");
                          } else {
                            SweetAlert.swal("Cancelled", response.info, "Done");
                          }
              })
                    // window.location=('#/customer').replace();
            }   else {
                    SweetAlert.swal("Cancelled!", "Done");
                  }
              })
                }

        }]);
