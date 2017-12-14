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
                    if ($scope.docAppointment) {
                    for (var i = 0; i<=$scope.docAppointment.length-1; i++) {
                        $scope.events.push(
                            {
                                "id":$scope.docAppointment[i].id,
                                "title":$scope.docAppointment[i].patient,
                                "start": new Date($scope.docAppointment[i].appointmentTime)
                            }
                        );
                    }
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
            $scope.createClicked = function(date) {
                if ($scope.checkDate(date)) {
                    if (UtilityService.checkUserLogin()) {
                        var date= new Date(date).toDateString("DD/mm/yyyy")
                        $scope.time = $filter('date')(new Date(), 'HH:mm');
                        $scope.appointmentTime = date + " " +$scope.time; 
                        $rootScope.date= $scope.appointmentTime;
                        $state.go('root.createEvent', {doctor:$rootScope.docId});
                    } else {
                        alert("Only Admin have right to create events");
                    }
                } 
            }
            $scope.checkDate = function (date) {
                $scope.currentDate = new Date();
                var currentYear = $scope.currentDate.getFullYear();
                var currentDay = $scope.currentDate.getDate();
                var currentMonth = $scope.currentDate.getMonth() +1;
                var eventYear = date.getFullYear();
                var eventDay = date.getDate();
                var eventMonth = date.getMonth() +1;
                if (eventYear<currentYear) {
                    alert("You can not create event for past date");
                    return false;
                    }
                else if (eventYear == currentYear) {
                    if (eventMonth<currentMonth) {
                        alert("You can not create event for past date");
                        return false;
                    }
                    else {
                        if (eventMonth == currentMonth) {
                            if (eventDay<currentDay) {
                                alert("You can not create event for past date");
                                return false;
                            } 
                            else {
                                return true;
                            }
                        }
                    }
                    
                }
                else {
                    if (eventYear > currentYear) return true;
                }
            };
    }]);
