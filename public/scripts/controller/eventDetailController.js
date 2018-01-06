angular.module('myApp')
    .controller('eventDetailCtrl', ['SweetAlert', '$rootScope', '$scope', '$state', '$filter', '$http', 'ngDialog', 'SERVER_BASE_URL', 'NgTableParams', 'event', 'UtilityService',
        function (SweetAlert, $rootScope, $scope, $state, $filter, $http, ngDialog, SERVER_BASE_URL, NgTableParams, event, UtilityService) {

            $scope.patientEvent = [];
            $scope.query = {
                date: $rootScope.date
            }

            $scope.isAuthenticate = UtilityService.checkUserLogin();
            $scope.doc =UtilityService.getDoctor();
            $http({
                method: 'POST',
                isArray: true,
                url: SERVER_BASE_URL + 'admin/doctor/getAppointmentByDoctor/date/' + $scope.doc.id + '/' + $rootScope.date,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Bearer " + localStorage.getItem("ngStorage-token")
                },
                data: $scope.query
            }).then(function (response) {
                $scope.patientEvent = response.data.Appointment;
            });

            $scope.tableParams = new NgTableParams({
                page: 1,
                count: 3
            }, {
                total: $scope.patientEvent.length,
                getData: function ($defer, params) {
                    if (params !== undefined) {
                        $scope.data = params.sorting() ? $filter('orderBy')($scope.patientEvent, params.orderBy()) : $scope.patientEvent;

                        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                        $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        $defer.resolve($scope.data);

                    }
                }
            });
            $scope.edit = function (patient) {
                console.log(patient);
                ngDialog.close();
                $rootScope.patientDetail = {
                    "appointmentId": patient.id,
                    "description": patient.description,
                    "location": patient.location,
                    "appointmentType": patient.appointmentType,
                    "appointmentTime": patient.appointmentTime,
                    "rescheduledTime": patient.rescheduledTime,
                    "doctorId": $scope.doc.id
                };
                $state.go('root.editEvent');
            };
        }]);
