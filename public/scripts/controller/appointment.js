angular.module('myApp')
    .controller('appointmentCtrl', ['$rootScope','$scope','$state','$filter','$http','ngDialog','SERVER_BASE_URL','$controller','NgTableParams','UtilityService',
        function ($rootScope,$scope, $state, $filter, $http, ngDialog,SERVER_BASE_URL,$controller,NgTableParams, UtilityService) {
            $scope.selectedItem = {};
            $rootScope.users=[];
            $scope.getAllAppointment = getAllAppointment;
            $scope.loginName=localStorage.getItem('ngStorage-loginName');   
            $scope.loginName = $scope.loginName.replace(/"/g,"");     
            $scope.$emit('editEvent',{selectDoctor:true});                
            $scope.isAuthenticate = UtilityService.checkUserLogin();
            $scope.allDocUrl= 'admin/doctor/getAllDoctors/name';
            $scope.appointmentUrl= 'admin/doctor/getAppointmentByDoctor/';

            $scope.doc = UtilityService.getDoctor();
            getAllAppointment($scope.doc);
            // UtilityService.apiGet($scope.allDocUrl,{}).then(function(response){
            //     $scope.response = response.data.doctor;
            //     var index = response.data.doctor.map(function(doctor, index){
            //         if (doctor.name === $rootScope.loginName) {
            //             return index;
            //         }
            //     })
            //     var docIndex;
            //     for (var i = index.length - 1; i >= 0; i--) {
            //         if (index[i]!= 'undefined' && index[i]!= undefined) {
            //             docIndex = index[i];
            //         } 
            //     }
            //     if (docIndex) {
            //     $scope.getEvent(response.data.doctor[docIndex])    
            //     }else{
            //     $scope.getEvent(response.data.doctor[0]);
            //     }
            // });
            $scope.edit = function(patient) {
                ngDialog.close();
               $rootScope.patientDetail ={ 
                "patient" : patient.patient,
                "disease" : patient.disease,
                "appointmentId":patient.appointmentId,
                "appointmentTime" : patient.appointmentTime,
                "status" : patient.status,
                "patientId" : patient.id,
                "doctorId" : event.docId
            }
                $state.go('editEvent');
            };
            // $scope.getEvent = function(doc){
                $rootScope.$on('docId', function(event, doc){
                    getAllAppointment(doc);
                })
                    // alert(doc.id);
                // $rootScope.docId = doc.id;
                // $rootScope.docName = doc.name;
                // $scope.selectedItem.name = doc.name;
                // $scope.selectedItem.id = doc.id;
                $scope.events = [];
            function getAllAppointment(doc) { 

                 UtilityService.apiGet($scope.appointmentUrl+doc.id,{}).then(function(response){
                    $scope.docAppointment = response.data.Appointment;
                    $scope.users=response.data.Appointment
                $scope.tableParams = new NgTableParams({
                    page: 1,
                    count: 3
                },{
                    total:$scope.users.length,
                    //Returns the table for rendering
                    getData : function($defer,params){
                    
                        $scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
                        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        $defer.resolve($scope.data);

                              }

                    });
                })
            }
        }]);
