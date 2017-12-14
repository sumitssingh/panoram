angular.module('myApp')
    .controller('eventListCtrl', ['$rootScope','$scope','$state','$filter','$http','ngDialog','NgTableParams','SERVER_BASE_URL','UtilityService',
        function ($rootScope,$scope, $state, $filter, $http, ngDialog,NgTableParams, SERVER_BASE_URL, UtilityService) {
            
            $scope.isAuthenticate = UtilityService.checkUserLogin();
            $scope.patientEvent=[];
            $scope.loginName=localStorage.getItem('ngStorage-loginName');
            $scope.loginName = $scope.loginName.replace(/"/g,"");
            $scope.selectedItem = {};

            $scope.selectedItem.name = $rootScope.docName;
            $scope.selectedItem.id = $rootScope.docId;
            
            $http({
                method: "GET",
                url: SERVER_BASE_URL+'admin/doctor/getAllDoctors/name',
                headers:{
                    'content-type':'Application/json',
                    'Authorization':"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJleHAiOjMwMjM1NjIwMywiaWF0IjoxNTA2NTk3MDE5fQ.ijDTib7qCuoQ0_MH33sV-Yu2Tf0VcDianhyyZWS-8R8"
                }
            }).then(function (response) {
                $scope.response = response.data.doctor;
                $scope.getEvent(response.data.doctor[0]);


        });

        $scope.getEvent = function(doc){
            $rootScope.docId = doc.id;
            $rootScope.docName = doc.name;
            $scope.selectedItem.name = doc.name;
            $scope.selectedItem.id = doc.id;
        }
            $scope.edit = function(patientId) {
                ngDialog.close();
                $rootScope.patientId = patientId;
                $rootScope.doctorId = event.docId;
                $state.go('root.editEvent');
            };

        }]);
