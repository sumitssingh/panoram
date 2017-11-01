angular.module('myApp')
    .controller('eventEditCtrl', ['$rootScope','$scope','$filter','$http','NgTableParams',
        function ($rootScope,$scope, $filter, $http, NgTableParams) {
$scope.selectedItem = {};
            $scope.patientEvent=[];
            $scope.patient=$rootScope.patientDetail;


            // $scope.Update = function() {

            $http({
                method: 'POST',
                isArray: false,
                url: 'http://localhost:3000/admin/doctor/rescheduled/appointment/current/patient/'+$scope.patient.appointmentId,

                headers: {
                    "Content-Type":"application/x-www-form-urlencoded",
                    "Authorization":"Bearer " +localStorage.getItem("ngStorage-token")
                },
                data: $scope.patient
            }).then(function(response){
                console.log($scope.patient);
            })
            $scope.query = {
                patientId:event.patientId
            }
            $http({
                method: 'POST',
                isArray: false,
                url: 'http://localhost:3000/admin/doctor/getAppointmentByDoctor/patient/'+event.docId +'/'+event.patientId,

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
