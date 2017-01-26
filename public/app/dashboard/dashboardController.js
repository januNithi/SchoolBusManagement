/**
 * Created by CSS on 08-12-2016.
 */


(function(){
    angular
        .module("myApp")
        .controller("dashboardController",dashboardController);

    dashboardController.$inject=[
        '$scope',
        '$window',
        '$filter',
        'dashboardService',
        'busRegistrationService',
        'notificationService',
        '$timeout',
        'leafletData',
        'loginService'

    ];

    function dashboardController($scope,$window,$filter,dashboardService,busRegistrationService,notificationService,$timeout,leafletData,loginService){


        var socket = io.connect();

        $scope.busData = [];
        $scope.currentBus = '1';
        $scope.paths = [];
        $scope.center = {};
        $scope.markers = {};
        $scope.selectedDate = '---- SELECT DATE ----';
        $scope.busPosition = [];

        $scope.choosenBuses =[];

        $scope.notify = false;
        $scope.notifyObj = {};
        $scope.readNotifyObj = [];
        $scope.unReadNotifyObj = [];

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

            if(value == 'routeMap'){
                return 'selected';
            }

        };

        loginService.isLoggedIn().then(function (result) {

            if(!result.data.id){
                loginService.goToLogin()
            }

        });

        $scope.onLogout = function () {
            loginService.onLogout().then(function () {
                loginService.goToLogin();
            });
        };

        $scope.dateOptions = {
            dateDisabled: 'disabled',
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        $scope.busChosen = function () {
            angular.forEach($scope.busData,function (value,index) {
                if(Number($scope.currentBus) == value.id){
                    if($scope.choosenBuses.length) {
                        var isExist = false;
                        angular.forEach($scope.choosenBuses, function (value1, index1) {
                            if(value1.id == value.id){
                                isExist = true;
                                alert('Already Selected');
                            }
                            if((index1 + 1) == $scope.choosenBuses.length){
                                if(!isExist){
                                    $scope.choosenBuses.push(value);
                                }
                            }
                        });
                    }else {
                        $scope.choosenBuses.push(value);
                    }
                }
            });

        };

        $scope.removeBus = function (data) {
            angular.forEach($scope.choosenBuses,function (value,index) {
                if(data.id == value.id){
                    $scope.choosenBuses.splice(index,1);
                }
            });
        };

        $scope.getBusDetails = function () {
            busRegistrationService.getBusRegData().then(function (result) {
                $scope.busData = result.data;
            },function (error) {
                console.log(error);
            });
        };

        $scope.getBusPositions = function (date) {

            $scope.busPosition = [];
            $scope.paths = [];
            $scope.center = {};
            $scope.markers = [];
            var string = '';

            angular.forEach($scope.choosenBuses,function (value,index) {
                var bus_id = {};
                angular.forEach($scope.choosenBuses,function (value,index) {
                    bus_id[value.id] = value.regNo + ' - ' + value.busCode;
                });
                if((index +1) == $scope.choosenBuses.length){
                    string += 'id_'+index+'='+value.id+'&length='+$scope.choosenBuses.length+'&date='+date;
                    dashboardService.getBusPosition(string).then(function (result) {
                        if(result.data.length > 0) {
                            $scope.busPosition = result.data;
                            $scope.markers = {};
                            angular.forEach(result.data,function (value,index) {
                                if(value.length > 0) {
                                    $scope.selectedDate = $filter('date')(value[0].date, "yyyy-MM-dd");
                                    $scope.markers['marker_' + index] = {
                                        lat: value[value.length - 1].lat,
                                        lng: value[value.length - 1].lng,
                                        icon: {
                                            iconUrl: 'images/bus_' + index + '.png',
                                        },
                                        message: 'Bus-' + bus_id[value[0].bus_id],
                                        iconSize: [38, 95],
                                        title: $filter('date')(value[value.length - 1].devicetime, "dd-MM-yyyy h:mm:ss a"),
                                        bus_id: value[0].bus_id,
                                        gpsUnit: value[0].deviceid,
                                        riseOnHover: true,
                                        opacity: 5,
                                        riseOffset: 250
                                    };

                                    $scope.center = {
                                        lat: value[value.length - 1].lat,
                                        lng: value[value.length - 1].lng,
                                        zoom: 18
                                    };

                                    var obj = {
                                        date: value[value.length - 1].date,
                                        gpsUnit: value[value.length - 1].deviceid
                                    };

                                    socket.emit('bus track', obj);
                                }
                            });

                            // $scope.busPosition = result.data;
                            // $scope.updateMap();
                            // $scope.markers = {
                            //     marker: {
                            //         lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                            //         lng: $scope.busPosition[$scope.busPosition.length - 1].lng,
                            //         icon: {
                            //             iconUrl: 'images/bus.png',
                            //         },
                            //         iconSize: [38, 95],
                            //         title: $filter('date')($scope.busPosition[$scope.busPosition.length - 1].devicetime, "dd-MM-yyyy h:mm:ss a"),
                            //         riseOnHover: true,
                            //         opacity: 5,
                            //         riseOffset: 250
                            //     }
                            // };

                            // $scope.center = {
                            //     lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                            //     lng: $scope.busPosition[$scope.busPosition.length - 1].lng,
                            //     zoom: 18
                            // };

                            // var obj = {
                            //     date: $scope.busPosition[$scope.busPosition.length - 1].date,
                            //     gpsUnit: $scope.busPosition[$scope.busPosition.length - 1].deviceid
                            // };
                            //
                            // socket.emit('bus track', obj);

                            // leafletData.getMap('map').then(function (map) {
                            //
                            //     L.circle([11.015298173932,76.96311294870613], Number(50)).addTo(map);
                            //
                            //
                            // });
                        }

                    },function (error) {
                        console.log(error);
                    });
                }else{
                    string += 'id_'+index+'='+value.id+'&';
                }
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
                    };
                    latLng.push(points);
                }

            });

        };

        $scope.showDate = function () {
            console.log($scope.selectedDate);
        };

        socket.on('notification',function (data) {

            $scope.notify = true;
            $scope.notifyObj = data;

        });
        
        socket.on('adminNotification',function (data) {

            $scope.notificationObject = data;
            $scope.readNotifyObj = [];
            $scope.unReadNotifyObj = [];
            angular.forEach(data,function (value,index) {
                if(value.dataRead){
                    $scope.readNotifyObj.push(value);
                }else{
                    $scope.unReadNotifyObj.push(value);
                }
            });
        });

        socket.on('Bus Stop',function (data) {
            $scope.notify = true;
            $scope.notifyStopObj = data;
        });

        socket.on('bus position',function (data) {
            var points = {
                lat: Number(data.lat),
                lng: Number(data.lng),
                riseOnHover: true,
                opacity: 5,
                riseOffset: 250
            };
            // $scope.busPosition.push(points);
            angular.forEach($scope.choosenBuses,function (value,index) {
                if(value.gpsUnit == Number(data.deviceId) && (new Date().toDateString() == new Date(Number(data.divTime)).toDateString())){
                    $scope.markers['marker_'+index].lat = Number(data.lat);
                    $scope.markers['marker_'+index].lng = Number(data.lng);
                    $scope.markers['marker_'+index].title = new Date(Number(data.divTime)).toLocaleString();
                }
            });
            // console.log(data.lat);
            // console.log(data.log);
            // $scope.markers.marker.lat = Number(data.lat);
            // $scope.markers.marker.lng = Number(data.lng);
            // $scope.markers.marker.title = data.devicetime.toLocaleString,
            $scope.center.lat = Number(data.lat);
            $scope.center.lng = Number(data.lng);

            leafletData.getMap(function (map) {
                map.invalidateSize();
            });
        });

        $scope.searchForBusPosition = function () {
            if ($scope.busPosition.length > 0) {
                angular.forEach($scope.busPosition,function (value,index) {
                    if(value.length > 0){
                        var obj = {
                            date: value[value.length - 1].date,
                            gpsUnit: value[value.length - 1].deviceid
                        };
                        socket.emit('stop track', obj);
                    }
                    if((index +1) == $scope.busPosition.length){
                        $scope.getBusPositions($filter('date')($scope.selectedDate, "yyyy-MM-dd"));
                    }
                });
            }else{
                $scope.getBusPositions($filter('date')($scope.selectedDate, "yyyy-MM-dd"));
            }
        };

        notificationService.getAdminNotification().then(function (result,err) {
            $scope.notificationObject = result.data;
            angular.forEach($scope.notificationObject,function (value,index) {
                if(value.dataRead){
                    $scope.readNotifyObj.push(value);
                }else{
                    $scope.unReadNotifyObj.push(value);
                }
            });
        });

        $scope.$on("$destroy", function(){
            if ($scope.busPosition.length > 0) {
                angular.forEach($scope.busPosition,function (value,index) {
                    if(value.length > 0){
                        var obj = {
                            date: value[value.length - 1].date,
                            gpsUnit: value[value.length - 1].deviceid
                        };
                        socket.emit('stop track', obj);
                    }
                });
            }
        });

        // $scope.getBusPositions(null,null);

        $scope.getBusDetails();

    }
})();

