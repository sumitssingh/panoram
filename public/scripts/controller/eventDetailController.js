angular.module('myApp')
    .controller('eventDetailCtrl', ['$rootScope','$scope','$state','$filter','$http','ngDialog','SERVER_BASE_URL','NgTableParams','event',
        function ($rootScope,$scope, $state, $filter, $http, ngDialog,SERVER_BASE_URL,NgTableParams,event) {

            $scope.patientEvent=[];
            $scope.query = {
                patientId:event.patientId
            }
            $http({
                method: 'POST',
                isArray: false,
                url: SERVER_BASE_URL+'admin/doctor/getAppointmentByDoctor/patient/'+event.docId +'/'+event.patientId,

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

            $scope.edit = function(patient) {
                ngDialog.close();
                console.log(patient);
               $rootScope.patientDetail ={ 
                "patient" : patient.patient,
                "disease" : patient.cause,
                "appointmentId":patient.appointmentId,
                "appointmentTime" : patient.appointmentTime,
                "status" : patient.status,
                "patientId" : patient.id,
                "doctorId" : event.docId
            }
                $state.go('editEvent');
            };


        }]);
