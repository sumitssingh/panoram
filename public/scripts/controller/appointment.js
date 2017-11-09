angular.module('myApp')
    .controller('appointmentCtrl', ['$rootScope','$scope','$state','$filter','$http','ngDialog','SERVER_BASE_URL','$controller','NgTableParams','UtilityService',
        function ($rootScope,$scope, $state, $filter, $http, ngDialog,SERVER_BASE_URL,$controller,NgTableParams, UtilityService) {
$scope.selectedItem = {};
$rootScope.users=[];
$scope.loginName=localStorage.getItem('ngStorage-loginName');   
$scope.loginName = $scope.loginName.replace(/"/g,"");                         
$scope.isAuthenticate = UtilityService.checkUserLogin();
                console.log($scope.isAuthenticate);
                        $scope.allDocUrl= 'admin/doctor/getAllDoctors/name';
                        $scope.appointmentUrl= 'admin/doctor/getAppointmentByDoctor';
                        UtilityService.apiGet($scope.allDocUrl,{}).then(function(response){
                            console.log(response);
                            $scope.response = response.data.doctor;
                            var index = response.data.doctor.map(function(doctor, index){
                                if (doctor.name === $rootScope.loginName) {
                                    return index;
                                }
                            })
                            var docIndex;
                            for (var i = index.length - 1; i >= 0; i--) {
                                if (index[i]!= 'undefined' && index[i]!= undefined) {
                                    docIndex = index[i];
                                } 
                            }
                            if (docIndex) {
                            $scope.getEvent(response.data.doctor[docIndex])    
                            }else{
                            $scope.getEvent(response.data.doctor[0]);
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
        $scope.getEvent = function(doc){
            console.log(doc);
            $rootScope.docId = doc.id;
            $rootScope.docName = doc.name;
            $scope.selectedItem.name = doc.name;
            $scope.selectedItem.id = doc.id;
            $scope.events = [];
            $http({
                method: "GET",
                url:  SERVER_BASE_URL+'admin/doctor/getAppointmentByDoctor/'+doc.id,
                headers: {
                    'content-type': 'Application/json',
                    'Authorization':"Bearer " + localStorage.getItem('ngStorage-token')
                }
            }).then(function (response) {
                console.log(response);

                $scope.docAppointment = response.data.Appointment;
                // for (var i = 0; i<=$scope.docAppointment.length-1; i++) {
                //     $scope.events.push(
                //         {
                //             "id":$scope.docAppointment[i].id,
                //             "title":$scope.docAppointment[i].patient,
                //             "start": new Date($scope.docAppointment[i].appointmentTime)
                //         }
                //     );
                // }
                // console.log($scope.events);
                // $scope.selected = $scope.events[0];
            // });
        // }


                // $scope.table = response;

                // $scope.tables=angular.toJson($scope.table);
                // $scope.value = JSON.parse($scope.tables);
            $scope.users=response.data.Appointment
console.log($scope.users);
       
          })

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
        }
        }]);
