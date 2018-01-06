angular.module('myApp')
    .controller('DashboardController', ['SweetAlert', '$rootScope', '$scope', '$filter', '$timeout', '$state', 'SERVER_BASE_URL', '$http', 'ngDialog', '$controller', 'UtilityService',
        function (SweetAlert, $rootScope, $scope, $filter, $timeout, $state, SERVER_BASE_URL, $http, ngDialog, $controller, UtilityService) {
            $rootScope.users = [];
            $scope.$emit('editEvent', {selectDoctor: true});
            $scope.appointmentUrl = 'admin/doctor/getAppointmentByDoctor/';
            $scope.appointmentLocUrl = 'admin/doctor/getAppointmentByDoctor/location/';
            $scope.getAllAppointment = getAllAppointment;
            $scope.doc = UtilityService.getDoctor();

            getAllAppointment($scope.doc);
            $scope.$on('docId', function (event, doc) {
                getAllAppointment(doc);
            });

            function getAllAppointment(doc) {
                $scope.events = [];
                $scope.doc =UtilityService.getDoctor(doc);
                // if ($scope.doc.location === 'Select Location' || $scope.doc.location === undefined || $scope.doc.location === null && $scope.doc.type === 'Select Type' || $scope.doc.type === undefined || $scope.doc.type === null) {
                if ($scope.doc.location === 'Select Location' && $scope.doc.appointmentType === 'Select Type') {
                    UtilityService.apiGet($scope.appointmentUrl + $scope.doc.id, {}).then(function (response) {
                        $scope.docAppointment = response.data.Appointment;
                        if ($scope.docAppointment)
                            for (var i = 0; i <= $scope.docAppointment.length - 1; i++) {
                                $scope.events.push(
                                    {
                                        "id": $scope.docAppointment[i].id,
                                        "title": $scope.docAppointment[i].patient,
                                        "start": new Date($scope.docAppointment[i].appointmentTime)
                                    }
                                );
                            }
                        $scope.selected = $scope.events[0];
                    });
                // } else if ($scope.doc.location && $scope.doc.type !== 'Select Type' || $scope.doc.type !== undefined || $scope.doc.type !== null) {
                } else if ($scope.doc.location && $scope.doc.appointmentType === 'Select Type') {
                    UtilityService.apiGet($scope.appointmentUrl + $scope.doc.id+'/location/'+$scope.doc.location, {}).then(function (response) {
                        $scope.docAppointment = response.data.Appointment;
                        if ($scope.docAppointment)
                            for (var i = 0; i <= $scope.docAppointment.length - 1; i++) {
                                $scope.events.push(
                                    {
                                        "id": $scope.docAppointment[i].id,
                                        "title": $scope.docAppointment[i].patient,
                                        "start": new Date($scope.docAppointment[i].appointmentTime)
                                    }
                                );
                            }
                        $scope.selected = $scope.events[0];
                    });
                } else if ($scope.doc.appointmentType && $scope.doc.location === 'Select Location') {
                    UtilityService.apiGet($scope.appointmentUrl+'type/' + $scope.doc.id+'/'+$scope.doc.appointmentType, {}).then(function (response) {
                        $scope.docAppointment = response.data.Appointment;
                        if ($scope.docAppointment)
                            for (var i = 0; i <= $scope.docAppointment.length - 1; i++) {
                                $scope.events.push(
                                    {
                                        "id": $scope.docAppointment[i].id,
                                        "title": $scope.docAppointment[i].patient,
                                        "start": new Date($scope.docAppointment[i].appointmentTime)
                                    }
                                );
                            }
                        $scope.selected = $scope.events[0];
                    });
                } else if ($scope.doc.appointmentType && $scope.doc.location) {
                    UtilityService.apiGet($scope.appointmentUrl + $scope.doc.id+'/'+$scope.doc.location+'/'+$scope.doc.appointmentType, {}).then(function (response) {
                        $scope.docAppointment = response.data.Appointment;
                        if ($scope.docAppointment)
                            for (var i = 0; i <= $scope.docAppointment.length - 1; i++) {
                                $scope.events.push(
                                    {
                                        "id": $scope.docAppointment[i].id,
                                        "title": $scope.docAppointment[i].patient,
                                        "start": new Date($scope.docAppointment[i].appointmentTime)
                                    }
                                );
                            }
                        $scope.selected = $scope.events[0];
                    });
                }
            }

            $scope.eventClicked = function (item) {
                // var date = item.start
                $rootScope.date = item.start;
                // $scope.time = $filter('date')(new Date(), 'MM y');
                ngDialog.open({
                    template: '../../views/eventDetail.html',
                    scope: $scope,
                    controller: $controller('eventDetailCtrl', {
                        $scope: $scope,
                        event: {docId: $scope.selectedItem.id}
                    })
                });
            };
            $scope.createClicked = function (date) {
                if ($scope.checkDate(date)) {
                    if (UtilityService.checkUserLogin()) {
                        var date = new Date(date).toDateString("MMM D YYYY")
                        $scope.time = $filter('date')(new Date(), 'h:mm a');
                        $scope.appointmentTime = date + " " + $scope.time;
                        $rootScope.date = $scope.appointmentTime;
                        $state.go('root.createEvent', {doctor: $rootScope.docId});
                    } else {
                        alert("Only Admin have right to create events");
                    }
                }
            }
            $scope.checkDate = function (date) {
                $scope.currentDate = new Date();
                var currentYear = $scope.currentDate.getFullYear();
                var currentDay = $scope.currentDate.getDate();
                var currentMonth = $scope.currentDate.getMonth() + 1;
                var eventYear = date.getFullYear();
                var eventDay = date.getDate();
                var eventMonth = date.getMonth() + 1;
                if (eventYear < currentYear) {
                    alert("You can not create event for past date");
                    return false;
                }
                else if (eventYear == currentYear) {
                    if (eventMonth < currentMonth) {
                        alert("You can not create event for past date");
                        return false;
                    }
                    else {
                        if (eventMonth >= currentMonth) {
                            if (eventDay < currentDay) {
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
