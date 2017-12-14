angular.module('myApp', [
    'ui.router',
  'ngAnimate',
    'ngStorage',
  'ngDialog',
    'ngResource',
    'ngTable',
  'ngMaterial',
  'oitozero.ngSweetAlert',
  'ngSanitize',
  '720kb.datepicker',
  'MassAutoComplete',
  'material.components.eventCalendar'
])
    .constant('SERVER_BASE_URL','http://107.170.218.205:3000/')
    // .constant('SERVER_BASE_URL','http://localhost:3000/')

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
        .state('login', {
            url:'/login',
            templateUrl: 'views/login.html',
            controller: 'AuthController',
            data: {
                    isAuthenticate: true
                }
        })
    .state('root', {
        url:'/',
        templateUrl: 'views/templates/header.html',
        controller: 'MainCtrl',
        data: {
                  isAuthenticate: true
              }
    })    
    .state('root.dashboard', {
        url:'dashboard',
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardController',
        data: {
                    isAuthenticate: true
                }
    })
        .state('root.editEvent', {
        url:'editEvent',
      templateUrl: 'views/editEvents.html',
      controller: 'eventEditCtrl',
        data: {
                    isAuthenticate: true
                }
    })
                .state('root.createEvent', {
        url:'createEvent/:doctor',
      templateUrl: 'views/add.html',
      controller: 'createEventCtrl',
        data: {
                    isAuthenticate: true
                }
    })
    //   .state('eventList', {
    //     url:'/eventList',
    //   templateUrl: 'views/eventList.html',
    //   controller: 'eventListCtrl'
    // })
          .state('root.appointment', {
        url:'appointment/list',
      templateUrl: 'views/appointment.html',
      controller: 'appointmentCtrl',
      controllerAs: 'vm',
        data: {
                    isAuthenticate: true
                }
    })
      .state('root.OnCall', {
        url:'OnCall',
      templateUrl: 'views/ScheduledDoctor.html',
      controller: 'OnCallCtrl',
      controllerAs: 'demo',
        data: {
                    isAuthenticate: true
                }
    })
    $urlRouterProvider.otherwise('/');
})
.run(['$rootScope', '$state', '$location', 'UtilityService', function($rootScope, $state, $location, UtilityService) {
    $rootScope.$state = $state;
    $rootScope.$on('$stateChangeStart', function(event, toState) {
        var loggedInUser = UtilityService.getLocalStorage('userInfo');

        if (loggedInUser && !toState.data.isAuthenticate) {
            event.preventDefault();
            $state.go('dashboard');
        }

        if (!loggedInUser && toState.data.isAuthenticate) {
            event.preventDefault();
            $state.go('login');
        }

    });
}])
