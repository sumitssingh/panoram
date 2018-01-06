angular.module('myApp')
    .controller('appointmentCtrl', ['SweetAlert', '$rootScope', '$scope', '$state', '$filter', '$http', 'ngDialog', 'SERVER_BASE_URL', '$controller', 'NgTableParams', 'UtilityService',
        function (SweetAlert, $rootScope, $scope, $state, $filter, $http, ngDialog, SERVER_BASE_URL, $controller, NgTableParams, UtilityService) {
            $scope.selectedItem = {};
            $rootScope.users = [];
            $scope.getAllAppointment = getAllAppointment;
            $scope.loginName = localStorage.getItem('ngStorage-loginName');
            $scope.loginName = $scope.loginName.replace(/"/g, "");
            $scope.$emit('editEvent', {selectDoctor: true});
            $scope.isAuthenticate = UtilityService.checkUserLogin();
            $scope.allDocUrl = 'admin/doctor/getAllDoctors/name';
            $scope.appointmentUrl = 'admin/doctor/getAppointmentByDoctor/';

            $scope.doc = UtilityService.getDoctor();
            getAllAppointment($scope.doc);
            $scope.edit = function (patient) {
                ngDialog.close();
                $rootScope.patientDetail = {
                    "appointmentId": patient.appointmentId,
                    "appointmentTime": patient.appointmentTime,
                    "rescheduledTime": patient.rescheduledTime,
                    "description": patient.description,
                    "location": patient.location,
                    "appointmentType": patient.appointmentType,
                    "doctorId": event.docId
                };
                $state.go('root.editEvent');
            };
            $scope.$on('docId', function (event, doc) {
                getAllAppointment(doc);
            });
            $scope.events = [];
            function getAllAppointment(doc) {
                $scope.events = [];
                $scope.doc =UtilityService.getDoctor(doc);
                // if ($scope.doc.location === 'Select Location' || $scope.doc.location === undefined || $scope.doc.location === null && $scope.doc.type === 'Select Type' || $scope.doc.type === undefined || $scope.doc.type === null) {
                if ($scope.doc.location === 'Select Location' && $scope.doc.appointmentType === 'Select Type') {
                    UtilityService.apiGet($scope.appointmentUrl + $scope.doc.id, {}).then(function (response) {
                        $scope.docAppointment = response.data.Appointment;
                        $scope.users = response.data.Appointment;
                    $scope.tableParams = new NgTableParams({
                        page: 1,
                        count: 3
                    }, {
                        total: $scope.users.length,
                        //Returns the table for rendering
                        getData: function ($defer, params) {

                            $scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
                            $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                            $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            $defer.resolve($scope.data);

                        }

                    });
                    });
                    // } else if ($scope.doc.location && $scope.doc.type !== 'Select Type' || $scope.doc.type !== undefined || $scope.doc.type !== null) {
                } else if ($scope.doc.location && $scope.doc.appointmentType === 'Select Type') {
                    UtilityService.apiGet($scope.appointmentUrl + $scope.doc.id+'/location/'+$scope.doc.location, {}).then(function (response) {
                        $scope.docAppointment = response.data.Appointment;
                        $scope.users = response.data.Appointment;
                    $scope.tableParams = new NgTableParams({
                        page: 1,
                        count: 3
                    }, {
                        total: $scope.users.length,
                        //Returns the table for rendering
                        getData: function ($defer, params) {

                            $scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
                            $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                            $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            $defer.resolve($scope.data);

                        }

                    });
                    });
                } else if ($scope.doc.appointmentType && $scope.doc.location === 'Select Location') {
                    UtilityService.apiGet($scope.appointmentUrl +'type/'+ $scope.doc.id+'/'+$scope.doc.appointmentType, {}).then(function (response) {
                        $scope.docAppointment = response.data.Appointment;
                        $scope.users = response.data.Appointment;
                    $scope.tableParams = new NgTableParams({
                        page: 1,
                        count: 3
                    }, {
                        total: $scope.users.length,
                        //Returns the table for rendering
                        getData: function ($defer, params) {

                            $scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
                            $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                            $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            $defer.resolve($scope.data);

                        }

                    });
                    });
                } else if ($scope.doc.appointmentType) {
                    UtilityService.apiGet($scope.appointmentUrl + $scope.doc.id+'/'+$scope.doc.location+'/'+$scope.doc.appointmentType, {}).then(function (response) {
                        $scope.docAppointment = response.data.Appointment;
                        $scope.users = response.data.Appointment;
                    $scope.tableParams = new NgTableParams({
                        page: 1,
                        count: 3
                    }, {
                        total: $scope.users.length,
                        //Returns the table for rendering
                        getData: function ($defer, params) {

                            $scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
                            $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
                            $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            $defer.resolve($scope.data);

                        }

                    });
                    });
                }
            }
        }]);
