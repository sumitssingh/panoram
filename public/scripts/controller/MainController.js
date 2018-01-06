angular.module('myApp')
    .controller('MainCtrl', ['SweetAlert','$rootScope','$scope','$filter', '$timeout', '$state','SERVER_BASE_URL', '$http','ngDialog','$controller','UtilityService',
        function(SweetAlert, $rootScope, $scope, $filter, $timeout, $state,SERVER_BASE_URL, $http, ngDialog, $controller, UtilityService) {
            $scope.selectedItem = {};
            $scope.appointment = {
            };
            $scope.selectedLocation = {};
            $rootScope.users=[];
            $scope.selectDoctor = true;
            $scope.loginName=localStorage.getItem('ngStorage-loginName');
            $scope.loginName = $scope.loginName.replace(/"/g,"");
            $scope.isAuthenticate = localStorage.getItem('ngStorage-isAuthenticate');

            $scope.allDocUrl= 'admin/doctor/getAllDoctors/name';
            $scope.allLocUrl= 'admin/doctor/fetch/All/location';
            $scope.allappointTypeUrl= 'admin/doctor/fetch/All/type';
            $scope.$on('editEvent', function(events, data){
                $scope.selectDoctor = data.selectDoctor;
            });
            UtilityService.apiGet($scope.allappointTypeUrl,{}).then(function(response){
                $scope.appointments = response.data;
                $scope.appointments = response.data.filter(function(elem, index, self) {
                   if (elem != null) {
                       return index == self.indexOf(elem);
                   }
                });
                $scope.appointments.unshift('Select Type');
                UtilityService.putEventType($scope.appointments[0]);
                $scope.selectAppointment = response.data[1];
            });
            UtilityService.apiGet($scope.allLocUrl,{}).then(function(response){
                $scope.location = response.data;
                $scope.location.unshift({location: 'Select Location', id:0});
                UtilityService.putLocation($scope.location[0].location);
                $scope.selectedLocation = response.data[0];
            });
            UtilityService.apiGet($scope.allDocUrl,{}).then(function(response){
                $scope.response = response.data.doctor;
                var index = response.data.doctor.map(function(doctor, index){
                    if (doctor.name === $rootScope.loginName) {
                        $scope.appointment.doctor.name = $rootScope.loginName;
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
                    $scope.selectAppDoctor(response.data.doctor[0])
                }else{
                    $scope.selectAppDoctor(response.data.doctor[0]);
                }
            })
            $scope.logout = function() {
                $rootScope.isAuthenticate =false;
            };
            $scope.selectAppDoctor = function(doc){
                if (doc){
                    UtilityService.putDoctor(doc.id);
                    $scope.$broadcast('docId', doc);
                    $scope.appointment.doctor = doc;
                    // $scope.selectedItem.id = doc.id;
                } else {
                    var doc = $scope.appointment.doctor;
                    UtilityService.putDoctor(doc.id);
                    $scope.$broadcast('docId', doc);
                    // $scope.selectedItem.name = doc.name;
                    // $scope.selectedItem.id = doc.id;
                }
            }
            $scope.selectLocation = function() {
                var loc = $scope.appointment.location;
                UtilityService.putLocation(loc.location);
                // $scope.selectedLocation.location = loc.location;
                // $scope.selectedLocation.id = loc.id;
                $scope.$broadcast('docId');
            }
            $scope.selectType = function() {
                var type = $scope.appointment.type;
                UtilityService.putEventType(type);
                $scope.selectAppointment = type;
                // $scope.selectedLocation.id = loc.id;
                $scope.$broadcast('docId');
            }
        }]);

