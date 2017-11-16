angular.module('myApp')
.factory('socket', function($rootScope) {

    // var socket = io.connect('http://ec2-35-182-103-205.ca-central-1.compute.amazonaws.com:8000');
    var socket = io.connect('http://107.170.218.205:3001');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});



