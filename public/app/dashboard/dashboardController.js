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
        'loginService',
        'deviceOffline',
        'deviceOnline',
        'deviceStopped',
        'unknown',
        'deviceMoving'

    ];

    function dashboardController($scope,$window,$filter,dashboardService,busRegistrationService,
                                 notificationService,$timeout,leafletData,loginService,
                                 deviceOffline,deviceOnline,deviceStopped,unknown,deviceMoving){


        var socket = io.connect();

        $scope.busData = [];
        $scope.currentBus = '1';
        $scope.paths = [];
        $scope.center = {};
        $scope.markers = {};
        $scope.selectedDate = '---- SELECT DATE ----';
        $scope.busPosition = [];

        $scope.deviceStatus = {
            deviceOffline : deviceOffline,
            deviceMoving : deviceMoving,
            deviceStopped : deviceStopped,
            deviceOnline : deviceOnline,
            unknown : unknown,
            undefined : unknown
        };

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

        $scope.busChosen = function (bus,id) {
            $scope.selectedRow = id;
            $scope.choosenBuses = [];
            $scope.choosenBuses.push(bus);
            $scope.selectedDate = $filter('date')(new Date(), "yyyy-MM-dd");
            $scope.searchForBusPosition();

        };

        // $scope.busChosen = function () {
        //     angular.forEach($scope.busData,function (value,index) {
        //         if(Number($scope.currentBus) == value.id){
        //             if($scope.choosenBuses.length) {
        //                 var isExist = false;
        //                 angular.forEach($scope.choosenBuses, function (value1, index1) {
        //                     if(value1.id == value.id){
        //                         isExist = true;
        //                         alert('Already Selected');
        //                     }
        //                     if((index1 + 1) == $scope.choosenBuses.length){
        //                         if(!isExist){
        //                             $scope.choosenBuses.push(value);
        //                         }
        //                     }
        //                 });
        //             }else {
        //                 $scope.choosenBuses.push(value);
        //             }
        //         }
        //     });
        //
        // };

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
                // var bus_image = '';
                angular.forEach($scope.busData,function (value,index) {
                    if(value.lastPosition) {
                        if(Number(value.lastPosition.altitude) > 360){
                            value.lastPosition.altitude = Number(value.lastPosition.altitude) - 360;
                        }



                        $scope.markers['marker_' + index] = {
                            lat: value.lastPosition.lat,
                            lng: value.lastPosition.lng,
                            icon: {
                                iconUrl: 'images/busIcon.png',
                                iconAnchor : [12,34],
                                popupAnchor:  [20, -10]
                            },
                            iconAngle : Number(value.lastPosition.altitude),
                            // message: 'Bus-' + value.regNo + '-' + value.busCode + ' on ' + $filter('date')(value.lastPosition.devicetime, "dd-MM-yyyy h:mm:ss a"),
                            message : '<div class="panel panel-primary">'+
                            '<div class="panel-heading">'+
                            'Bus-' + value.regNo + '-' + value.busCode +
                            '</div>'+
                            '<div class="panel-body">'+
                            '<div class="form">'+
                            '<div class="form-group">'+
                            '<label>UniqueID:</label>'+
                            '<label>'+value.lastPosition.deviceid+'</label>'+
                            '</div>'+
                            '<div class="form-group">'+
                            '<label>Time:</label>'+
                            '<label>'+$filter('date')(value.lastPosition.devicetime, "dd-MM-yyyy h:mm:ss a")+'</label>'+
                            '</div>'+
                            '<div class="form-group">'+
                            '<label>Latitude:</label>'+
                            '<label>'+value.lastPosition.lat+'</label>'+
                            '</div>'+
                            '<div class="form-group">'+
                            '<label>Longitude:</label>'+
                            '<label>'+value.lastPosition.lng+'</label>'+
                            '</div>'+
                            '</div>'+
                            '</div>'+
                            '</div>',
                            iconSize: [38, 95],
                            title: $filter('date')(value.lastPosition.devicetime, "dd-MM-yyyy h:mm:ss a"),
                            // bus_id: value[0].bus_id,
                            // gpsUnit: value[0].deviceid,
                            riseOnHover: true,
                            opacity: 5,
                            riseOffset: 250
                        };

                        $scope.center = {
                            lat: value.lastPosition.lat,
                            lng: value.lastPosition.lng,
                            zoom: 18
                        };

                        // var obj = {
                        //     date: value[value.length - 1].date,
                        //     gpsUnit: value[value.length - 1].deviceid
                        // };
                        //
                        // socket.emit('bus track', obj);
                    }
                });
            },function (error) {
                console.log(error);
            });
        };

        $scope.getBusPositions = function (date) {


            var date = $filter('date')(new Date, "yyyy-MM-dd");

            $scope.busPosition = [];
            $scope.paths = [];
            $scope.center = {};
            $scope.markers = [];
            var string = '';
            var bus_id = {};
            angular.forEach($scope.choosenBuses,function (value,index) {

                angular.forEach($scope.choosenBuses,function (value,index) {
                    bus_id[value.id] = value.regNo + ' - ' + value.busCode;
                });
                if((index +1) == $scope.choosenBuses.length){
                    string += 'id_'+index+'='+value.id+'&length='+$scope.choosenBuses.length+'&date='+date;
                    dashboardService.getBusPosition(string).then(function (result) {
                        if(result.data && result.data.length > 0) {

                            $scope.busPosition = result.data;
                            $scope.markers = {};
                            angular.forEach(result.data,function (value,index) {
                                if(value && value.length > 0) {
                                    if(!($scope.selectedDate == $filter('date')(value[value.length -1].date, "yyyy-MM-dd"))){
                                        angular.element("#triggerWarning").trigger('click');
                                    }
                                    if(Number(value[value.length - 1].altitude) > 360){
                                        value.altitude = Number(value[value.length - 1].altitude) - 360;
                                    }
                                    $scope.selectedDate = $filter('date')(value[0].date, "yyyy-MM-dd");
                                    $scope.markers['marker_' + value[0].deviceid] = {
                                        lat: value[value.length - 1].lat,
                                        lng: value[value.length - 1].lng,
                                        icon: {
                                            iconUrl: 'images/busIcon.png',
                                            iconAnchor : [12,34],
                                            popupAnchor:  [20, -10]
                                        },
                                        iconAngle: Number(value[value.length - 1].altitude),
                                        // message: 'Bus-' + bus_id[value[0].bus_id] + ' on ' + $filter('date')(value[value.length - 1].devicetime, "dd-MM-yyyy h:mm:ss a"),
                                        message : '<div class="panel panel-primary">'+
                                            '<div class="panel-heading">'+
                                        'Bus-' + $scope.choosenBuses[0].regNo + '-' + $scope.choosenBuses[0].busCode +
                                        '</div>'+
                                        '<div class="panel-body">'+
                                        '<div class="form">'+
                                        '<div class="form-group">'+
                                        '<label>Time:</label>'+
                                        '<label>'+$filter('date')(value[value.length - 1].devicetime, "dd-MM-yyyy h:mm:ss a")+'</label>'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                        '<label>UniqueID:</label>'+
                                        '<label>'+value[value.length - 1].deviceid+'</label>'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                        '<label>Latitude:</label>'+
                                        '<label>'+value[value.length - 1].lat+'</label>'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                        '<label>Longitude:</label>'+
                                        '<label>'+value[value.length - 1].lng+'</label>'+
                                        '</div>'+
                                        '</div>'+
                                        '</div>'+

                                        '</div>',
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
                                        date: value[value.length - 1].devicetime,
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
            $scope.busData.forEach(function (value,index) {

                if($scope.notifyObj.event.deviceId == value.gpsUnit){
                    value.status = $scope.notifyObj.event.type;
                    // if($scope.notifyObj.event.type == 'deviceOnline'){
                    //     value.status = "images/Circle_Green_small.png";
                    // }else if($scope.notifyObj.event.type == 'deviceOffline'){
                    //     value.status = "images/Circle_Red_small.png";
                    // }else if($scope.notifyObj.event.type == 'deviceMoving'){
                    //     value.status = "images/greendot.gif";
                    // }else if($scope.notifyObj.event.type == 'deviceStopped'){
                    //     value.status = "images/Circle_Orange_small.gif";
                    // }else{
                    //     value.status = "images/Circle_Yellow_small";
                    // }
                }

            });

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

                    if(Number(data.altitude) > 360){
                        data.altitude = Number(value.lastPosition.altitude) - 360;
                    }
                    $scope.markers['marker_'+value.gpsUnit].lat = Number(data.lat);
                    $scope.markers['marker_'+value.gpsUnit].lng = Number(data.lng);
                    $scope.markers['marker_'+value.gpsUnit].icon.iconUrl = 'images/busIcon.png';
                    $scope.markers['marker_'+value.gpsUnit].iconAngle = Number(data.altitude);
                    $scope.markers['marker_'+value.gpsUnit].title = new Date(Number(data.divTime)).toLocaleString();
                    $scope.markers['marker_'+value.gpsUnit].message = $scope.markers['marker_'+value.gpsUnit].message.split('on')[0] + ' on '+ new Date(Number(data.divTime)).toLocaleString();
                    $scope.markers['marker_'+value.gpsUnit].message = '<div class="panel panel-primary">'+
                        '<div class="panel-heading">'+
                        'Bus-' + value.regNo + '-' + value.busCode +
                        '</div>'+
                        '<div class="panel-body">'+
                        '<div class="form">'+
                        '<div class="form-group">'+
                        '<label>UniqueID:</label>'+
                        '<label>'+data.UniqueId+'</label>'+
                        '</div>'+
                        '<div class="form-group">'+
                        '<label>Time:</label>'+
                        '<label>'+$filter('date')(Number(data.divTime), "dd-MM-yyyy h:mm:ss a")+'</label>'+
                        '</div>'+
                        '<div class="form-group">'+
                        '<label>Latitude:</label>'+
                        '<label>'+data.lat+'</label>'+
                        '</div>'+
                        '<div class="form-group">'+
                        '<label>Longitude:</label>'+
                        '<label>'+data.lng+'</label>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+

                        '</div>';
                }
            });
            $scope.center.lat = Number(data.lat);
            $scope.center.lng = Number(data.lng);

            leafletData.getMap(function (map) {
                map.invalidateSize();
            });
        });

        $scope.searchForBusPosition = function () {
            if ($scope.busPosition.length > 0) {
                angular.forEach($scope.busPosition,function (value,index) {
                    if(value && value.length > 0){
                        var obj = {
                            date: value[value.length - 1].devicetime,
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
                            date: value[value.length - 1].devicetime,
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

