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
                if (UtilityService.checkUserLogin()) {
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