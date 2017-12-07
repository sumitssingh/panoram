angular.module('myApp')
    .controller('DashboardController', ['$rootScope','$scope','$filter', '$timeout', '$state','SERVER_BASE_URL', '$http','ngDialog','$controller','UtilityService',
        function($rootScope, $scope, $filter, $timeout, $state,SERVER_BASE_URL, $http, ngDialog, $controller, UtilityService) {
            $rootScope.users=[]; 
            $scope.$emit('editEvent',{selectDoctor:true});    
            $scope.appointmentUrl= 'admin/doctor/getAppointmentByDoctor/';

            $scope.getAllAppointment = getAllAppointment;
            $scope.doc = UtilityService.getDoctor();

            getAllAppointment($scope.doc);
            $rootScope.$on('docId', function(event, doc){
                getAllAppointment(doc);
            });
            function getAllAppointment(doc) { 
                $scope.events = [];
                UtilityService.apiGet($scope.appointmentUrl+doc.id,{}).then(function(response){
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
                    $scope.selected = $scope.events[0];
                });
            }
            $scope.eventClicked = function (item) {
                // var date = item.start
                $rootScope.date = item.start;
                console.log($rootScope.date);
                // $scope.time = $filter('date')(new Date(), 'MM y');
                // console.log($scope.time);
                ngDialog.open({
                    template: '../../views/eventDetail.html',
                    scope: $scope,
                    controller: $controller('eventDetailCtrl', {
                        $scope: $scope,
                        event: {docId:$scope.selectedItem.id}
                    })
                });
            };
            $scope.createClicked = function (date) {
                console.log(date);
                $scope.currentDate = new Date();
                console.log($scope.currentDate);
                var currentYear = $scope.currentDate.getFullYear();
                var currentDay = $scope.currentDate.getDate();
                var currentMonth = $scope.currentDate.getMonth() +1;
                var eventYear = date.getFullYear();
                var eventDay = date.getDate();
                var eventMonth = date.getMonth() +1;
                console.log(eventMonth);
                console.log(eventYear);
                console.log(eventDay);
                console.log(currentMonth);
                console.log(currentYear);
                console.log(currentDay);
                if (eventYear<currentYear) {
                    alert("err")
                    }
                else if (eventYear == $scope.currentYear) {
                    if (eventMonth<currentMonth) {
                            alert("err")
                        }
                    else {
                        if (eventMonth == currentMonth) {
                            if (eventDay<currentDay) {
                                    alert("err")
                                }
                            }
                        }

                    }
                    else {
                        if (UtilityService.checkUserLogin()) {
                             var date= new Date(date).toDateString("DD/mm/yyyy")
                             $scope.time = $filter('date')(new Date(), 'HH:mm');
                             $scope.appointmentTime = date + " " +$scope.time; 
                             $rootScope.date= $scope.appointmentTime;
                             $state.go('createEvent', {doctor:$rootScope.docId});
                        } else {
                            alert("Only Admin have right to create events");
                        }
                }  
            };
    }]);
