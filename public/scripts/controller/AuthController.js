angular.module('myApp')
    .controller('AuthController', ['$rootScope','$scope','$state', 'UtilityService',
        function($rootScope, $scope,$state, UtilityService) {
        $scope.loginFormObj = {};
        $rootScope.loginName=localStorage.getItem('ngStorage-loginName');
        $scope.login = function login() {

                $scope.showInvalidCredential = false;
                if($scope.loginFormObj.email=='admin@gmail.com' && $scope.loginFormObj.password=='panorama'){
                console.log($scope.loginFormObj);
                UtilityService.apiPost('admin/login',$scope.loginFormObj).then(function(response){
                    response = response.data;
                    if(response.status){
                        $rootScope.isAuthenticate = true;
                        UtilityService.setLocalStorage('loginName', 'Admin');
                        UtilityService.setLocalStorage('isAuthenticate', true);
                        UtilityService.setLocalStorage('token', response.token);
                        UtilityService.setLocalStorage('userInfo', {email:$scope.loginFormObj.email,name:'admin'});
                        $state.go('root.dashboard');
                    }else{
                        console.log(response.data);
                        $scope.showInvalidCredential = true;
                    }
                    $scope.loginBtn = false;
                },function(error){
                    $scope.loginBtn = false;
                });
            }else {
                UtilityService.apiPost('auth/login',$scope.loginFormObj).then(function(response){
                    if(response.status){
                        UtilityService.setLocalStorage('loginName', response.username);
                UtilityService.setLocalStorage('isAuthenticate', false);
                $state.go('root.dashboard');
            }
            },function(error){
                    $scope.loginBtn = false;
                });
            
        };
    }
    }]);
// angular.module('myApp')
//     .controller('root.DashboardController', ['$rootScope','$scope','$filter', '$timeout', '$state','SERVER_BASE_URL', '$http','ngDialog','$controller','UtilityService',
//         function($rootScope, $scope, $filter, $timeout, $state,SERVER_BASE_URL, $http, ngDialog, $controller, UtilityService) {