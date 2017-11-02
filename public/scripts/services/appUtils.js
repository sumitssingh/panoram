
    angular.module('myApp')
        .service('UtilityService', ['$http','$resource','$localStorage','SERVER_BASE_URL',
            function($http,$resource, $localStorage, SERVER_BASE_URL, Headers) {
        /* Set Local Storage */

        var currentDoctor = {};
        var config = {headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ngStorage-token'),
            'Content-Type': 'application/json;'
            }
        }
        this.setLocalStorage = function(index, data) {
            $localStorage[index] = data;
        };

        /* Get Local Storage */
        this.getLocalStorage = function(index) {
            if ($localStorage[index]) {
                return $localStorage[index];
            } else {
                return false;
            }
        };

        /* Remove Local Storage */
        this.removeLocalStorage = function(index) {
            delete $localStorage[index];
        };

        /* Check User Login */
        this.checkUserLogin = function() {
            // Removes all local storage
            if (this.getLocalStorage('isAuthenticate')) {
                return true;
            } else {
                return false;
            }
        };

        /* Get Login User Detail */
        this.getUserInfo = function() {
            return this.getLocalStorage('userInfo');
        };
        this.putDoctor = function (id) {
            currentDoctor.id = id;
        }
        this.getDoctor = function (id) {
            return currentDoctor;
        }
        this.apiGet = function(url) {
            return $http.get(SERVER_BASE_URL +url,config);
        };
        // this.apiPost = function(url, data) {
        //     return $resource(SERVER_BASE_URL +url ,{},{
        //         'query':{
        //             method: 'POST',
        //             isArray: false,
        //             header:{
        //                 "Content-Type":"application/json",
        //                 "Authorization":"Bearer " + sessionStorage.getItem('jwt');
        //             },
        //         }
        //     });
        // };
        this.apiPost = function(url, data) {
            return $http.post(SERVER_BASE_URL +url, data);
        };

        this.apiPut = function(url, data) {
            return $http.put(SERVER_BASE_URL +url, data);
        };

        this.apiDelete = function(url, data) {
            return $http.delete(SERVER_BASE_URL +url, data);
        };
        /* Remove range slider */
        // this.showAlert = function(message, type) {
        //     ngNotify.set(message, {
        //         theme: 'pure',
        //         position: 'top',
        //         duration: 1000,
        //         type: type,
        //         sticky: false,
        //         button: true,
        //         html: false
        //     });
        // };

        this.getObjectIndex = function(list, field, val) {
            var index = list.map(function(obj, index) {
                if(obj[field] == val) {
                    return index;
                }
            }).filter(isFinite);

            return index;
        };


    }]);
