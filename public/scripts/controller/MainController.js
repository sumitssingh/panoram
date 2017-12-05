angular.module('myApp')
.controller('MainCtrl', ['$rootScope','$scope','$filter', '$timeout', '$state','SERVER_BASE_URL', '$http','ngDialog','$controller','UtilityService',
        function($rootScope, $scope, $filter, $timeout, $state,SERVER_BASE_URL, $http, ngDialog, $controller, UtilityService) {
	        $scope.selectedItem = {};
            $rootScope.users=[];
            $scope.selectDoctor = true;
            $scope.loginName=localStorage.getItem('ngStorage-loginName');   
            $scope.loginName = $scope.loginName.replace(/"/g,"");                         
            $scope.isAuthenticate = UtilityService.checkUserLogin();

            $scope.allDocUrl= 'admin/doctor/getAllDoctors/name';
            $scope.$on('editEvent', function(events, data){
                $scope.selectDoctor = data.selectDoctor;
            })
            UtilityService.apiGet($scope.allDocUrl,{}).then(function(response){
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
                $rootScope.$broadcast('docId',doc);
                UtilityService.putDoctor(doc.id);
                $scope.selectedItem.name = doc.name;
                $scope.selectedItem.id = doc.id;
            }
}]);

