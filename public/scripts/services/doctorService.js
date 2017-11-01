angular.module('myApp')
    .factory('loginService', function($resource,SERVER_BASE_URL){
        return $resource(SERVER_BASE_URL + '/public/login',{},{
            'query':{
                method: 'POST',
                isArray: false,
                header:{
                    "Content-Type":"application/json",
                    // "Authorization":"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJybm8iLCJleHAiOjE0ODEzNzM5MzQsInNlY3JldCI6ImtleSIsImRhdGEiOnsiaWQiOnRydWV9fQ.g5TAa_zQxtmDIB1dvDJj6k0XXcoTAjRzTtYNeCS0Fq4"
                },
            }
        });
    });
