angular.module('myApp')
    .controller('eventEditCtrl', ['SweetAlert','$rootScope','$scope','$filter','$http','NgTableParams','SERVER_BASE_URL','UtilityService',
        function (SweetAlert,$rootScope,$scope, $filter, $http, NgTableParams, SERVER_BASE_URL, UtilityService) {

            $scope.patientEvent=[];
            $scope.patient=$rootScope.patientDetail;
            console.log($scope.patient);

            $scope.isAuthenticate = UtilityService.checkUserLogin();

            $scope.$emit('editEvent',{selectDoctor:false});
            $scope.Update = function() {
                console.log($scope.patient);
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
                            method: 'PUT',
                            isArray: false,
                            url: SERVER_BASE_URL+'admin/doctor/rescheduled/appointment/'+$scope.patient.doctorId+'/'+$scope.patient.appointmentId,
                            headers: {
                                "Content-Type":"application/json",
                                "Authorization":"Bearer " +localStorage.getItem("ngStorage-token")
                            },
                            data: $scope.patient
                        }).then(function(response){
                            if (status) {
                                $scope.patient = {};
                            SweetAlert.swal("Saved!", "Your data has been saved.", "success");
                            } else {
                                SweetAlert.swal("Cancelled!", "Something is not right pls try again");
                            }
                        })
                    }   else {
                        SweetAlert.swal("Cancelled!", "Your data is temporarily in the table");
                    }
                })
            }
            // $http({
            //     method: 'POST',
            //     isArray: false,
            //     url: SERVER_BASE_URL+'admin/doctor/getAppointmentByDoctor/patient/'+$scope.patient.doctorId +'/'+$scope.patient.patientId,

            //     headers: {
            //         "Content-Type":"application/x-www-form-urlencoded",
            //         "Authorization":"Bearer " +localStorage.getItem("ngStorage-token")
            //     },
            //     data: $scope.query
            // }).then(function(response){
            //     $scope.patientEvent=response.data.Appointment;

            // })
            // $scope.tableParams = new NgTableParams({
            //     page: 1,
            //     count: 3
            // },{
            //     total:$scope.patientEvent.length,
            //     getData : function($defer,params){
            //         if(params !== undefined){
            //             $scope.data = params.sorting() ? $filter('orderBy')($scope.patientEvent, params.orderBy()) : $scope.patientEvent;

            //             $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
            //             $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
            //             $defer.resolve($scope.data);

            //         }
            //     }

            // });

        }]);
