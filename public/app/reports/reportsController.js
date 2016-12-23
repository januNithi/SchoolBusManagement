/**
 * Created by CSS on 23-12-2016.
 */

(function(){
    angular
        .module("myApp")
        .controller("reportsController",reportsController);

    reportsController.$inject=[
        '$scope',
        '$window',
        '$filter',
        'leafletData',
        'loginService'

    ];

    function reportsController($scope,$window,$filter,leafletData,loginService){

        var socket = io.connect();

        $scope.busData = [];
        $scope.currentBus = '1';
        $scope.paths = [];
        $scope.center = {};
        $scope.markers = {};
        $scope.selectedDate = '---- SELECT DATE ----';
        $scope.busPosition = [];

        $scope.notify = false;
        $scope.notifyObj = {};

        angular.extend($scope, {
            centerProperty: {
                lat: 11.015,
                lng: 76.96
            },
            zoomProperty: 8,
            clickedLatitudeProperty: null,
            clickedLongitudeProperty: null,
        });

        $scope.showSelectable = function (value) {

            if(value == 'report'){
                return 'selected';
            }

        };

        loginService.isLoggedIn().then(function (result) {

            if(!result.data.id){
                loginService.goToLogin()
            }

        });

        $scope.logout = function () {
            loginService.onLogout().then(function () {
                loginService.goToLogin();
            });
        };

        $scope.getBusDetails = function () {
            busRegistrationService.getBusRegData().then(function (result) {
                $scope.busData = result.data;
            },function (error) {
                console.log(error);
            });
        };

        $scope.getBusPositions = function (id,date) {

            $scope.busPosition = [];
            $scope.paths = [];
            $scope.center = {};
            $scope.markers = [];

            homeService.getBusPosition(id,date).then(function (result) {
                if(result.data.length > 0) {
                    $scope.selectedDate = $filter('date')(result.data[0].date, "yyyy-MM-dd");
                    $scope.busPosition = result.data;
                    $scope.updateMap();
                    $scope.markers = {
                        marker: {
                            lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                            lng: $scope.busPosition[$scope.busPosition.length - 1].lng,
                            icon: {
                                iconUrl: 'images/bus.png',
                            },
                            iconSize: [38, 95],
                            title: $filter('date')($scope.busPosition[$scope.busPosition.length - 1].devicetime, "dd-MM-yyyy h:mm:ss a"),
                            riseOnHover: true,
                            opacity: 5,
                            riseOffset: 250
                        }
                    };

                    $scope.center = {
                        lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                        lng: $scope.busPosition[$scope.busPosition.length - 1].lng,
                        zoom: 18
                    };

                    var obj = {
                        date: $scope.busPosition[$scope.busPosition.length - 1].date,
                        gpsUnit: $scope.busPosition[$scope.busPosition.length - 1].deviceid
                    };

                    socket.emit('bus track', obj);
                }

            },function (error) {
                console.log(error);
            });

        };



        $scope.updateMap = function () {
            var latLng = [];
            angular.forEach($scope.busPosition, function (value, index) {

                if ((index + 1) == $scope.busPosition.length) {
                    var points = {
                        lat: value.lat,
                        lng: value.lng,
                        title: value.devicetime,
                        riseOnHover: true,
                        opacity: 5,
                        riseOffset: 250
                    }
                    latLng.push(points);
                    $scope.paths = {
                        p1: {
                            color: 'red',
                            weight: 4,
                            latlngs: $scope.busPosition
                        }

                    };
                    $scope.center = {
                        lat: value.lat,
                        lng: value.lng,
                        zoom: 18
                    };
                    $scope.markers = {
                        currentPosition: {
                            lat: value.lat,
                            lng: value.lng,
                            icon: {
                                iconUrl: 'images/bus.png',
                            },
                            iconSize: [38, 95],
                            title: value.devicetime,
                            riseOnHover: true,
                            opacity: 5,
                            riseOffset: 250,
                            move:true
                        }
                    }

                } else {
                    var points = {
                        lat: value.lat,
                        lng: value.lng,
                        icon: {
                            iconUrl: 'images/Circle_Blue.png',
                        },
                        title: value.devicetime,
                        riseOnHover: true,
                        opacity: 5,
                        riseOffset: 250
                    }
                    latLng.push(points);
                }

            });

        }

        $scope.showDate = function () {
            console.log($scope.selectedDate);
        };

        socket.on('notification',function (data) {

            $scope.notify = true;
            $scope.notifyObj = data;

        });

        socket.on('bus position',function (data) {

            var points = {
                lat: Number(data.lat),
                lng: Number(data.log),
                riseOnHover: true,
                opacity: 5,
                riseOffset: 250
            }
            $scope.busPosition.push(points);
            console.log(data.lat);
            console.log(data.log);
            $scope.markers.marker.lat = Number(data.lat);
            $scope.markers.marker.lng = Number(data.log);
            $scope.center.lat = Number(data.lat);
            $scope.center.lng = Number(data.log);

            leafletData.getMap(function (map) {
                map.invalidateSize();
            });
        });

        $scope.searchForBusPosition = function () {
            if ($scope.busPosition.length > 0) {
                var obj = {
                    date: $scope.busPosition[$scope.busPosition.length - 1].date,
                    gpsUnit: $scope.busPosition[$scope.busPosition.length - 1].deviceid
                };
                socket.emit('stop track', obj);
            }
            $scope.getBusPositions($scope.currentBus,$filter('date')($scope.selectedDate, "yyyy-MM-dd"));
        };

        // $scope.getBusPositions(null,null);
        //
        // $scope.getBusDetails();

    }
})();

