angular.module('myApp')
    .controller('DashboardController', ['$rootScope','$scope','$filter', '$timeout', '$state','SERVER_BASE_URL', '$http','ngDialog','$controller','UtilityService',
        function($rootScope, $scope, $filter, $timeout, $state,SERVER_BASE_URL, $http, ngDialog, $controller, UtilityService) {
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
                for (var i = 0; i<=$scope.docAppointment.length-1; i++) {
                    $scope.events.push(
                        {
                            "id":$scope.docAppointment[i].id,
                            "title":$scope.docAppointment[i].patient,
                            "start": new Date($scope.docAppointment[i].appointmentTime)
                        }
                    );
                }
                console.log($scope.events);
                $scope.selected = $scope.events[0];
            });
        }


        $scope.eventClicked = function (item) {
            console.log(item);
            console.log($scope.selectedItem.id);
            ngDialog.open({
                template: '../../views/eventDetail.html',
                scope: $scope,
                controller: $controller('eventDetailCtrl', {
                    $scope: $scope,
                    event: {docId:$scope.selectedItem.id,patientId:item.id}
                })
            });
        };

        $scope.createClicked = function (date) {
            if ($scope.isAuthenticate) {
             var date= new Date(date).toDateString("DD/mm/yyyy")
             $scope.time = $filter('date')(new Date(), 'HH:mm');
             $scope.appointmentTime = date + " " +$scope.time; 
             $rootScope.date= $scope.appointmentTime;
             $state.go('createEvent', {doctor:$rootScope.docId});
         } else {
            alert("Only Admin have right to create events");
         }
        };

    }]);
