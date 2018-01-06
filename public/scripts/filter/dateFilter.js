angular.module('myApp')
    .filter('panoDate', [
        '$filter', function ($filter) {
            return function (input, format) {
                return $filter('date')(new Date(input), format);
            };
        }
    ]);