angular.module('myApp')
    .controller('eventListCtrl', ['$rootScope','$scope','$state','$filter','$http','ngDialog','NgTableParams','SERVER_BASE_URL','UtilityService',
        function ($rootScope,$scope, $state, $filter, $http, ngDialog,NgTableParams, SERVER_BASE_URL, UtilityService) {
$scope.isAuthenticate = UtilityService.checkUserLogin();
            $scope.patientEvent=[];
            $scope.loginName=localStorage.getItem('ngStorage-loginName');
            $scope.loginName = $scope.loginName.replace(/"/g,"");
            $scope.selectedItem = {};
            // $scope.query = {
            //     patientId:event.patientId
            // }
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
                            console.log(response);
                            $scope.response = response.data.doctor;
                            $scope.getEvent(response.data.doctor[0]);


                    });

        $scope.getEvent = function(doc){
            console.log(doc);
            $rootScope.docId = doc.id;
            $rootScope.docName = doc.name;
            $scope.selectedItem.name = doc.name;
            $scope.selectedItem.id = doc.id;
        }
       //  	$http({
       //      method: 'GET',
       //      isArray: false,
       //      url: SERVER_BASE_URL+'admin/doctor/getAppointmentByDoctor/'+doc.id,

       //      headers: {

       //            "Content-Type":"application/json",
       //              "Authorization":"Bearer " +localStorage.getItem("ngStorage-token")
       //        }
       //    }).then(function(response){
       //      console.log(response.data.Appointment);
       //      // $scope.chat();
       //      $scope.users=response.data.Appointment
       // console.log($scope.users);
       var simpleList = [{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876},{name: "Moroni", age: 50, money: 876}];
          var self = this;
    self.tableParams = new NgTableParams({}, {
      dataset: simpleList
    });
            // $scope.usersTable = new ngTableParams({
            //     page: 1,
            //     count: 10
            // }, {
            //     total: $scope.users.length, 


            //     getData: function ($defer, params) {
            //        $scope.data = params.sorting() ? $filter('orderBy')($scope.users, params.orderBy()) : $scope.users;
            //        $scope.data = params.filter() ? $filter('filter')($scope.data, params.filter()) : $scope.data;
            //        $scope.data = $scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count());
            //        $defer.resolve($scope.data);
            //     }
            // });
            // });
            $scope.edit = function(patientId) {
                ngDialog.close();
                $rootScope.patientId = patientId;
                $rootScope.doctorId = event.docId;
                $state.go('editEvent');
            };
// }

        }]);
