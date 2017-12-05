angular.module('myApp')
    .controller('eventDetailCtrl', ['$rootScope','$scope','$state','$filter','$http','ngDialog','SERVER_BASE_URL','NgTableParams','event','UtilityService',
        function ($rootScope,$scope, $state, $filter, $http, ngDialog,SERVER_BASE_URL,NgTableParams,event, UtilityService) {

            $scope.patientEvent=[];
            $scope.query = {
             date:$rootScope.date
            }

            console.log($scope.query);
            $scope.isAuthenticate = UtilityService.checkUserLogin();
            $http({
                method: 'POST',
                isArray: true,
                url: SERVER_BASE_URL+'admin/doctor/getAppointmentByDoctor/date/'+event.docId+'/'+$rootScope.date,

                headers: {
                    "Content-Type":"application/x-www-form-urlencoded",
                    "Authorization":"Bearer " +localStorage.getItem("ngStorage-token")
                },
                data: $scope.query
            }).then(function(response){
                $scope.patientEvent=response.data.Appointment;
            })

            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 3
            },{
                total:$scope.patientEvent.length,
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
