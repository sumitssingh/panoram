angular.module('myApp')
    .controller('eventEditCtrl', ['SweetAlert','$rootScope','$scope','$filter','$http','NgTableParams','SERVER_BASE_URL','UtilityService',
        function (SweetAlert,$rootScope,$scope, $filter, $http, NgTableParams, SERVER_BASE_URL, UtilityService) {
$scope.selectedItem = {};
$scope.loginName=localStorage.getItem('ngStorage-loginName');
$scope.loginName = $scope.loginName.replace(/"/g,"");
            $scope.patientEvent=[];
             $scope.patient=$rootScope.patientDetail;
console.log( $scope.patient);

$scope.isAuthenticate = UtilityService.checkUserLogin();

            $scope.Update = function() {

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
                method: 'PUT',
                isArray: false,
                url: SERVER_BASE_URL+'admin/doctor/rescheduled/appointment/current/patient/'+$scope.patient.doctorId,

                headers: {
                    "Content-Type":"application/x-www-form-urlencoded",
                    "Authorization":"Bearer " +localStorage.getItem("ngStorage-token")
                },
                data: $scope.patient
            }).then(function(response){
                console.log($scope.patient);
                if (status) {
                    $scope.patient = {};
                SweetAlert.swal("Saved!", "Your data has been saved.", "success");
                } else {
                    SweetAlert.swal("Cancelled!", "Something is not right pls try again");
                }
            })
                    
                    // window.location=('#/customer').replace();
            }   else {
                    SweetAlert.swal("Cancelled!", "Your data is temporarily in the table");
                  }
              })

        }
            // $scope.query = {
            //     patientId:event.patientId
            // }

            $http({
                method: 'POST',
                isArray: false,
                url: SERVER_BASE_URL+'admin/doctor/getAppointmentByDoctor/patient/'+$scope.patient.doctorId +'/'+$scope.patient.patientId,

                headers: {
                    "Content-Type":"application/x-www-form-urlencoded",
                    "Authorization":"Bearer " +localStorage.getItem("ngStorage-token")
                },
                data: $scope.query
            }).then(function(response){
                // localStorage.setItem("userData", response);
                console.log(response);
                // $scope.table = response;

                // $scope.tables=angular.toJson($scope.table);
                // $scope.value = JSON.parse($scope.tables);
                $scope.patientEvent=response.data.Appointment;
                console.log($scope.patientEvent);

            })

            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 3
            },{
                total:$scope.patientEvent.length,
                //Returns the table for rendering
                getData : function($defer,params){
                    if(params !== undefined){
                        $scope.data = params.sorting() ? $filter('orderBy')($scope.patientEvent, params.orderBy()) : $scope.patientEvent;

                        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        $defer.resolve($scope.data);

                    }
                }

            });

            $scope.show = function(id,email,mobile,status) {
                $rootScope.id = id;
                $rootScope.email = email;
                $rootScope.mobile = mobile;
                $rootScope.status =status;
                // console.log($rootScope.id);
                window.location=('#/recruiter/myProfile').replace();
            }


        }]);
