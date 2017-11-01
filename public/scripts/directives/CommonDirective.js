
    angular.module('myApp')
        .directive('fileModel', ['$parse', '$compile', '$timeout', function($parse, $compile, $timeout) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;
                    element.bind('change', function() {
                        scope.$apply(function() {
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }])
        .directive('ngCompare', function() {
        var compareEl;
        return {
            require: 'ngModel',
            link: function(scope, currentEl, attrs, ctrl) {
                var comparefield = document.getElementsByName(attrs.ngCompare)[0]; //getting first element
                compareEl = angular.element(comparefield);

                //current field key up
                currentEl.on('keyup', function() {
                    if (compareEl.val() !== "") {
                        var isMatch = currentEl.val() === compareEl.val();
                        ctrl.$setValidity('compare', isMatch);
                        scope.$digest();
                    }
                });

                //Element to compare field key up
                compareEl.on('keyup', function() {
                    if (currentEl.val() !== "") {
                        var isMatch = currentEl.val() === compareEl.val();
                        ctrl.$setValidity('compare', isMatch);
                        scope.$digest();
                    }
                });
            }
        };
    })
        .directive('onlyDigits', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                canApply: '&'
            },
            link: function(scope, element, attr, ctrl) {

                if (attr['canApply']) {
                    scope.canApply = scope.canApply({si: scope.$parent.index, qi: scope.$parent.qi});
                } else {
                    scope.canApply = true;
                }

                function inputValue(val) {
                    if (val) {
                        var digits = val.replace(/[^0-9]/g, '');

                        if (digits !== val) {
                            ctrl.$setViewValue(digits);
                            ctrl.$render();
                        }
                        return parseInt(digits, 10);
                    }
                    return undefined;
                }
                if (scope.canApply) {
                    ctrl.$parsers.push(inputValue);
                }

            }
        };
    })
        .directive('selectPicker', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                require: '?ngModel',
                priority: 10,
                compile: function (tElement, tAttrs, transclude) {
                    tElement.selectpicker($parse(tAttrs.selectpicker)());
                    tElement.selectpicker('refresh');
                    return function (scope, element, attrs, ngModel) {
                        if (!ngModel) return;

                        scope.$watch(attrs.ngModel, function (newVal, oldVal) {
                            scope.$evalAsync(function () {
                                if (!attrs.ngOptions || /track by/.test(attrs.ngOptions)) element.val(newVal);
                                element.selectpicker('refresh');
                            });
                        });

                        ngModel.$render = function () {
                            scope.$evalAsync(function () {
                                element.selectpicker('refresh');
                            });
                        }
                    };
                }

            };
        }])

        .directive('lowerCase', function() {
		return {
		  require: 'ngModel',
		  link: function(scope, element, attrs, modelCtrl) {
			var lowercase = function(inputValue) {
			  if (inputValue == undefined) inputValue = '';
			  var lowercase = inputValue.toLowerCase();
			  if (lowercase !== inputValue) {
				modelCtrl.$setViewValue(lowercase);
				modelCtrl.$render();
			  }
			  return lowercase;
			}
			modelCtrl.$parsers.push(lowercase);
			lowercase(scope[attrs.ngModel]); // lowercase initial value
		  }
		};
	})
        .filter('dateFormat', function() {
			return function(input) {
				return moment(input).format('DD/MM/YYYY');
			}
	});
