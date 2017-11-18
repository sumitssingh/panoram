angular.module('myApp')
    .controller('AuthController', ['$rootScope','$scope','$state', 'UtilityService',
        function($rootScope, $scope,$state, UtilityService) {
        $scope.loginFormObj = {};
        $rootScope.loginName=localStorage.getItem('ngStorage-loginName');
        $scope.login = function login() {

                //$scope.loginBtn = true;
                $scope.showInvalidCredential = false;
                if($scope.loginFormObj.email=='admin@gmail.com' && $scope.loginFormObj.password=='panorama'){
                //  UtilityService.setLocalStorage('userInfo', {email:$scope.loginFormObj.email,name:'admin'});
                //   $state.go('root.dashboard');
                console.log($scope.loginFormObj);
                UtilityService.apiPost('admin/login',$scope.loginFormObj).then(function(response){

                    response = response.data;
                    if(response.status){
                        UtilityService.setLocalStorage('loginName', 'Admin');
                        UtilityService.setLocalStorage('isAuthenticate', true);
                        UtilityService.setLocalStorage('token', response.token);
                        UtilityService.setLocalStorage('userInfo', {email:$scope.loginFormObj.email,name:'admin'});
                        $state.go('dashboard');
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
                $state.go('dashboard');
            }
            },function(error){
                    $scope.loginBtn = false;
                });
            
        };
    }
    }]);