angular.module('myApp')
    .controller('OnCallCtrl', ['$scope', '$rootScope', '$sce', '$q', '$http', 'SweetAlert', 'NgTableParams', 'SERVER_BASE_URL', 'UtilityService', 'onCallService',
        function ($scope, $rootScope, $sce, $q, $http, SweetAlert, NgTableParams, SERVER_BASE_URL, UtilityService, onCallService) {

            $scope.loginName = localStorage.getItem('ngStorage-loginName');
            $scope.loginName = $scope.loginName.replace(/"/g, "");
            $scope.row = {};
            $scope.OnCall = [];
            $scope.$emit('editEvent', {selectDoctor: false});
            var id = []
            var states = [];
            $scope.isData = false;
            // $scope.getOnCall = getOnCall;
            $scope.isAuthenticate = UtilityService.checkUserLogin();
            $scope.locationUrl = 'admin/doctor/fetch/All/location';
            $scope.minDate = new Date().toDateString();
            $http({
                method: "GET",
                url: SERVER_BASE_URL+'admin/doctor/getAllDoctors/name',
                headers:{
                    'content-type':'Application/json',
                    'Authorization':"Bearer " + localStorage.getItem('ngStorage-token')
                }
            }).then(function (response) {

                $scope.response = response.data.doctor;
                var doctor = response.data.doctor.map(function(doc){
                    return doc.name;
                });

                UtilityService.apiGet($scope.locationUrl,{}).then(function(response){

                    states = response.data.map(function(loc){
                        return loc.location;
                    })
                });

                function suggest_state(term) {

                    var q = term.toLowerCase().trim();
                    var results = [];

                    for (var i = 0; i < states.length && results.length < 10; i++) {
                        var state = states[i];
                        if (state.toLowerCase().indexOf(q) === 0)
                            results.push({ label: state, value: state });
                    }

                    return results;
                }

                $scope.autocomplete_location = {
                    suggest: suggest_state
                };
                function suggest_doctor(term) {

                    var q = term.toLowerCase().trim();
                    var results = [];

                    for (var i = 0; i < doctor.length && results.length < 10; i++) {
                        var name = doctor[i];
                        if (name.toLowerCase().indexOf(q) === 0)
                            results.push({ label: name, value: name });
                    }

                    return results;
                }

                $scope.autocomplete_options = {
                    suggest: suggest_doctor
                };

            });


            $scope.Save = function () {

                SweetAlert.swal({
                        title: "Are you sure?",
                        text: "Do you want to save the data?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, save it!",
                        cancelButtonText: "No, cancel it!",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            $scope.isData = false;
                            $http({
                                method: "POST",
                                url: SERVER_BASE_URL + 'admin/doctor/onCall/providers',
                                headers: {
                                    'content-type': 'Application/json',
                                    'Authorization': "Bearer " + localStorage.getItem('ngStorage-token')
                                },
                                data: $scope.OnCall
                            }).then(function (response) {
                                $scope.OnCall = [];
                                SweetAlert.swal("Saved!", "Your data has been saved.", "success");
                                // getOnCall();
                            })
                        } else {
                            SweetAlert.swal("Cancelled!", "Your data is temporarily in the table");
                        }
                    })
            }
            var self = this;

            onCallService.query(function (response) {
                // $scope.loading = false;
                $scope.people = response.data;
                var data = [];
                var people = [];
                data = response;
                for (var i = 0; i < data.length; i++) {
                    people.unshift({
                        "id": data[i]._id,
                        "doctor": data[i].doctor.username,
                        "location": data[i].location,
                        "time": data[i].date
                    });
                }
                var originalData = angular.copy(people);


                self.tableParams = new NgTableParams({}, {
                    dataset: angular.copy(people)
                });
                self.deleteCount = 0;

                self.add = add;
                self.cancelChanges = cancelChanges;
                self.del = del;
                self.hasChanges = hasChanges;
                self.saveChanges = saveChanges;

                //////////

                function add() {
                    self.isEditing = true;
                    self.isAdding = true;
                    self.tableParams.settings().dataset.unshift({
                        doctor: "",
                        location: null,
                        time: null
                    });

                    self.tableParams.sorting({});
                    self.tableParams.page(1);
                    self.tableParams.reload();
                }

                function cancelChanges() {
                    resetTableStatus();
                    var currentPage = self.tableParams.page();
                    self.tableParams.settings({
                        dataset: angular.copy(originalData)
                    });
                    // keep the user on the current page when we can
                    if (!self.isAdding) {
                        self.tableParams.page(currentPage);
                    }
                }

                function del(row) {
                    SweetAlert.swal({
                            title: "Are you sure?",
                            text: "Do you really want to delete the data?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55", confirmButtonText: "Yes, delete it!",
                            cancelButtonText: "No, cancel it!",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function (isConfirm) {
                            if (isConfirm) {
                                $http({
                                    method: "PUT",
                                    url: SERVER_BASE_URL + 'admin/doctor/onCall/providers',
                                    headers: {
                                        'content-type': 'Application/json',
                                        'Authorization': "Bearer " + localStorage.getItem('ngStorage-token')
                                    },
                                    data: row
                                }).then(function (response) {

                                    SweetAlert.swal("Saved!", "Your data has been removed.", "success");
                                })
                                // window.location=('#/customer').replace();
                            } else {
                                SweetAlert.swal("Cancelled!", "Your data is safe");
                            }
                        })
                    _.remove(self.tableParams.settings().dataset, function (item) {
                        return row === item;
                    });
                    self.deleteCount++;
                    self.tableTracker.untrack(row);
                    self.tableParams.reload().then(function (data) {
                        if (data.length === 0 && self.tableParams.total() > 0) {
                            self.tableParams.page(self.tableParams.page() - 1);
                            self.tableParams.reload();
                        }
                    });
                }

                function hasChanges() {
                    return self.tableForm.$dirty || self.deleteCount > 0
                }

                function resetTableStatus() {
                    self.isEditing = false;
                    self.isAdding = false;
                    self.deleteCount = 0;
                    self.tableTracker.reset();
                    self.tableForm.$setPristine();
                }

                function saveChanges() {
                    $scope.dataChanged = false;
                    var tempData = angular.copy(self.tableParams.settings().dataset);
                    data = tempData;
                    if (originalData && originalData.length > 0) {
                        for (var i = 0; i <= originalData.length - 1; i++) {
                            // if (doctor.indexOf(data[0].doctor)<0 || states.indexOf(data[0].location) < 0) {
                            //     cancelChanges();
                            //     data.splice(0, 1);
                            //     $scope.dataChanged = true;
                            //     SweetAlert.swal("Cancelled!", "Please Select data from dropedown only");
                            // }else 
                            if (data[0].doctor === originalData[i].doctor && data[0].time === originalData[i].time) {
                                cancelChanges();
                                SweetAlert.swal("Cancelled!", "Dr. " + data[0].doctor + ' have already an Oncall events on '+data[0].time);
                                data.splice(0, 1);
                                $scope.dataChanged = true;
                            }
                        }
                    } else {
                        if ($scope.OnCall.length > 1) {
                            for (var j = 0; j <= $scope.OnCall.length - 1; j++) {
                            //     if (doctor.indexOf(data[0].doctor)<0 || states.indexOf(data[0].location) < 0) {
                            //     cancelChanges();
                            //     data.splice(0, 1);
                            //     $scope.dataChanged = true;
                            //     SweetAlert.swal("Cancelled!", "Please Select data from dropedown only");
                            // }else 
                                if (data[0].doctor === $scope.OnCall[j].doctor && data[0].time === $scope.OnCall[j].time) {
                                    cancelChanges();
                                    SweetAlert.swal("Cancelled!", "Dr. " + data[0].doctor + ' have already an Oncall events on '+data[0].time);
                                } else {
                                    resetTableStatus();
                                    var currentPage = self.tableParams.page();
                                    originalData = angular.copy(self.tableParams.settings().dataset);
                                }
                            }
                        }
                    }
                    if (!$scope.dataChanged) {
                        resetTableStatus();
                        var currentPage = self.tableParams.page();
                        originalData = angular.copy(self.tableParams.settings().dataset);
                        data = originalData;
                        $scope.OnCall.push(data[0]);
                        $scope.isData = true;
                        for (var i = $scope.response.length - 1; i >= 0; i--) {
                            for (var j = $scope.OnCall.length - 1; j >= 0; j--) {
                                if ($scope.OnCall[j].doctor === $scope.response[i].name) {
                                    id.push($scope.response[i].id);

                                }
                            }
                        }
                    }
                }
            })
            // }

        }]);


(function () {
    "use strict";

    angular.module("myApp").run(configureDefaults);
    configureDefaults.$inject = ["ngTableDefaults"];

    function configureDefaults(ngTableDefaults) {
        ngTableDefaults.params.count = 5;
        ngTableDefaults.settings.counts = [];
    }
})();

(function () {
    angular.module("myApp").directive("demoTrackedTable", demoTrackedTable);

    demoTrackedTable.$inject = [];

    function demoTrackedTable() {
        return {
            restrict: "A",
            priority: -1,
            require: "ngForm",
            controller: demoTrackedTableController
        };
    }

    demoTrackedTableController.$inject = ["$scope", "$parse", "$attrs", "$element"];

    function demoTrackedTableController($scope, $parse, $attrs, $element) {
        var self = this;
        var tableForm = $element.controller("form");
        var dirtyCellsByRow = [];
        var invalidCellsByRow = [];

        init();

        ////////

        function init() {
            var setter = $parse($attrs.demoTrackedTable).assign;
            setter($scope, self);
            $scope.$on("$destroy", function () {
                setter(null);
            });

            self.reset = reset;
            self.isCellDirty = isCellDirty;
            self.setCellDirty = setCellDirty;
            self.setCellInvalid = setCellInvalid;
            self.untrack = untrack;
        }

        function getCellsForRow(row, cellsByRow) {
            return _.find(cellsByRow, function (entry) {
                return entry.row === row;
            })
        }

        function isCellDirty(row, cell) {
            var rowCells = getCellsForRow(row, dirtyCellsByRow);
            return rowCells && rowCells.cells.indexOf(cell) !== -1;
        }

        function reset() {
            dirtyCellsByRow = [];
            invalidCellsByRow = [];
            setInvalid(false);
        }

        function setCellDirty(row, cell, isDirty) {
            setCellStatus(row, cell, isDirty, dirtyCellsByRow);
        }

        function setCellInvalid(row, cell, isInvalid) {
            setCellStatus(row, cell, isInvalid, invalidCellsByRow);
            setInvalid(invalidCellsByRow.length > 0);
        }

        function setCellStatus(row, cell, value, cellsByRow) {
            var rowCells = getCellsForRow(row, cellsByRow);
            if (!rowCells && !value) {
                return;
            }

            if (value) {
                if (!rowCells) {
                    rowCells = {
                        row: row,
                        cells: []
                    };
                    cellsByRow.push(rowCells);
                }
                if (rowCells.cells.indexOf(cell) === -1) {
                    rowCells.cells.push(cell);
                }
            } else {
                _.remove(rowCells.cells, function (item) {
                    return cell === item;
                });
                if (rowCells.cells.length === 0) {
                    _.remove(cellsByRow, function (item) {
                        return rowCells === item;
                    });
                }
            }
        }

        function setInvalid(isInvalid) {
            self.$invalid = isInvalid;
            self.$valid = !isInvalid;
        }

        function untrack(row) {
            _.remove(invalidCellsByRow, function (item) {
                return item.row === row;
            });
            _.remove(dirtyCellsByRow, function (item) {
                return item.row === row;
            });
            setInvalid(invalidCellsByRow.length > 0);
        }
    }
})();

(function () {
    angular.module("myApp").directive("demoTrackedTableRow", demoTrackedTableRow);

    demoTrackedTableRow.$inject = [];

    function demoTrackedTableRow() {
        return {
            restrict: "A",
            priority: -1,
            require: ["^demoTrackedTable", "ngForm"],
            controller: demoTrackedTableRowController
        };
    }

    demoTrackedTableRowController.$inject = ["$attrs", "$element", "$parse", "$scope"];

    function demoTrackedTableRowController($attrs, $element, $parse, $scope) {
        var self = this;
        var row = $parse($attrs.demoTrackedTableRow)($scope);
        var rowFormCtrl = $element.controller("form");
        var trackedTableCtrl = $element.controller("demoTrackedTable");

        self.isCellDirty = isCellDirty;
        self.setCellDirty = setCellDirty;
        self.setCellInvalid = setCellInvalid;

        function isCellDirty(cell) {
            return trackedTableCtrl.isCellDirty(row, cell);
        }

        function setCellDirty(cell, isDirty) {
            trackedTableCtrl.setCellDirty(row, cell, isDirty)
        }

        function setCellInvalid(cell, isInvalid) {
            trackedTableCtrl.setCellInvalid(row, cell, isInvalid)
        }
    }
})();

(function () {
    angular.module("myApp").directive("demoTrackedTableCell", demoTrackedTableCell);

    demoTrackedTableCell.$inject = [];

    function demoTrackedTableCell() {
        return {
            restrict: "A",
            priority: -1,
            scope: true,
            require: ["^demoTrackedTableRow", "ngForm"],
            controller: demoTrackedTableCellController
        };
    }

    demoTrackedTableCellController.$inject = ["$attrs", "$element", "$scope"];

    function demoTrackedTableCellController($attrs, $element, $scope) {
        var self = this;
        var cellFormCtrl = $element.controller("form");
        var cellName = cellFormCtrl.$name;
        var trackedTableRowCtrl = $element.controller("demoTrackedTableRow");

        if (trackedTableRowCtrl.isCellDirty(cellName)) {
            cellFormCtrl.$setDirty();
        } else {
            cellFormCtrl.$setPristine();
        }

        $scope.$watch(function () {
            return cellFormCtrl.$dirty;
        }, function (newValue, oldValue) {
            if (newValue === oldValue) return;

            trackedTableRowCtrl.setCellDirty(cellName, newValue);
        });

        $scope.$watch(function () {
            return cellFormCtrl.$invalid;
        }, function (newValue, oldValue) {
            if (newValue === oldValue) return;

            trackedTableRowCtrl.setCellInvalid(cellName, newValue);
        });
    }
})();

