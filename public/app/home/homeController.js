/**
 * Created by CSS on 08-12-2016.
 */


(function(){
    angular
        .module("myApp")
        .controller("homeController",homeController);

    homeController.$inject=[
        '$scope',
        '$window',
        '$filter',
        'homeService',
        'busRegistrationService',
        '$timeout',
        'leafletData',
        'loginService',
        'configService'

    ];

    function homeController($scope,$window,$filter,homeService,busRegistrationService,$timeout,leafletData,loginService,configService){


        // var socket = io.connect();

        $scope.busData = [];
        $scope.currentBus = '0';
        $scope.paths = {};
        $scope.center = {};
        $scope.markers = {};
        $scope.fromTime = '----SELECT----';
        $scope.toTime = '----SELECT----';
        $scope.busPosition = [];
        $scope.config = {};
        $scope.legend = {};
        var data=null;

        loginService.isLoggedIn().then(function (result) {

            if(!result.data.id){
                loginService.goToLogin()
            }else{
                $scope.getBusDetails();
                configService.getConfiguration().then(function (result) {
                    $scope.config = result.data;
                    $scope.legend = {
                            position: 'topright',
                            colors: [ $scope.config.overSpeedColor, $scope.config.rashTurnColor, '#478bf7'],
                            labels: [ 'Over Speed', 'Rash Turn', 'Route Path' ]
                    }
                },function (error) {
                    console.log(error);
                });

            }

        });


        angular.extend($scope, {
            centerProperty: {
                lat: 11.015,
                lng: 76.96
            },
            zoomProperty: 8,
            clickedLatitudeProperty: null,
            clickedLongitudeProperty: null,
            events: {
                map: {
                    enable: ['click', 'drag', 'blur', 'touchstart'],
                    logic: 'emit'
                },
                path: {
                    enable: [ 'click', 'mouseover' ]
                }
            },
            layercontrol: {
                icons: {
                    uncheck: "fa fa-toggle-off",
                    check: "fa fa-toggle-on"
                }
            },
            controls: {
                fullscreen: {
                    position: 'topleft'
                }
            },
            layers: {
                baselayers: {

                    osm: {
                        name: "OpenStreetMap",
                        type: "xyz",
                        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                        layerOptions: {
                            subdomains: ["a", "b", "c"],
                            attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                            continuousWorld: true
                        }
                    },
                    cycle: {
                        name: "OpenCycleMap",
                        type: "xyz",
                        url: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                        layerOptions: {
                            subdomains: ["a", "b", "c"],
                            attribution: "&copy; <a href=\"http://www.opencyclemap.org/copyright\">OpenCycleMap</a> contributors - &copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors",
                            continuousWorld: true
                        }
                    }
                },
                overlays: {

                }
            },

        });

        $scope.showSelectable = function (value) {

            if(value == 'home'){
                return 'selected';
            }

        };


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

        $scope.$on('leafletDirectivePath.click', function (event) {
            console.log(event);
        });

        $scope.getBusDetails = function () {
            busRegistrationService.getBusRegData().then(function (result) {
                $scope.busData = result.data;
            },function (error) {
                console.log(error);
            });
        };

        $scope.getBusPositions = function (id,fromTime,toTime) {
            //$scope.clearMap();
            $scope.busPosition = [];
            $scope.paths = {};
            $scope.center = {};
            $scope.markers = {};
            $scope.point=[];

            homeService.getBusPosition(id,fromTime,toTime).then(function (result) {
                if(result.data.length > 0) {
                    $scope.busPosition = result.data;
                    $scope.updateMap();
                    // $scope.updateOverSpeed();
                    // $scope.rashSpeed();
                    $scope.center = {
                        lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                        lng: $scope.busPosition[$scope.busPosition.length - 1].lng,
                        zoom: 21
                    };
                }

            },function (error) {
               console.log(error);
            });

        };
        $scope.updateMap = function () {
            var latLng = [];
            var pointList = [];
            
            var greenIcon = L.icon({
                iconUrl: 'images/slider-marker.png',
                iconAnchor : [12,34],
                popupAnchor:  [1, -30]
            });
            var i = 1;
            angular.forEach($scope.busPosition, function (value, index) {

                if ((index + 1) == $scope.busPosition.length) {

                    $scope.markers.
                        positionStart= {

                            lat: $scope.busPosition[0].lat,
                            lng: $scope.busPosition[0].lng,
                            iconSize: [38, 95],
                            time: "2013-01-22 10:24:59+01",
                            icon: {

                                iconUrl: 'images/school-bus.png',
                                color: 'green'
                            },
                            title: value.devicetime,
                            message: '<strong>Start:></strong>' + 'DeviceTime:' + new Date($scope.busPosition[0].devicetime).toLocaleString(),
                            riseOnHover: true,
                            opacity: 5,
                            riseOffset: 250,
                            move: true
                        };
                    $scope.markers.
                        positionEnd= {
                            lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                            lng: $scope.busPosition[$scope.busPosition.length - 1].lng,
                            iconSize: [38, 95],
                            icon: {

                                iconUrl: 'images/school-bus.png',
                                color: 'green'
                            },
                            title: value.devicetime,
                            time: "2013-01-22 10:24:59+01",
                            message: '<strong>End:></strong>' + 'DeviceTime:' + new Date($scope.busPosition[$scope.busPosition.length - 1].devicetime).toLocaleString(),
                            riseOnHover: true,
                            opacity: 5,
                            riseOffset: 250,
                            move: true
                        };

                    $scope.paths['p'+i] = {
                        color : '#478bf7',
                        weight : 4,
                        latlngs : latLng,
                        clickable : true
                    };
                    $scope.center = {
                        lat: value.lat,
                        lng: value.lng,
                        zoom: 18
                    };

                    leafletData.getMap('map').then(function (map) {

                        var marker1 = L.marker([value.lat, value.lng], {time: value.devicetime,icon: greenIcon,clickable:true, riseOnHover:true})
                            .bindPopup('<strong>'+value.devicetime+'</strong>');
                        marker1.on('add',function (event) {
                            leafletData.getMap('map').then(function (map) {
                                map.setView(marker1._latlng);
                            });
                        });
                        pointList.push(marker1);
                        if(map._controlContainer.children[1].children[2]){
                            map._controlContainer.children[1].children[2].remove();
                            $scope.clearMap(map);
                        }
                        var layerGroup = L.layerGroup(pointList);
                        var sliderControl = L.control.sliderControl({layer:layerGroup, follow: true, rezoom: 10});
                        map.addControl(sliderControl);
                        sliderControl.startSlider();

                    });

                    if(!(new Date(value.devicetime) < new Date($scope.toTime) && new Date(value.devicetime) > new Date($scope.fromTime))){
                        angular.element("#triggerWarning").trigger('click');
                        $scope.fromTime = value.devicetime;
                        $scope.toTime = value.devicetime;
                    }

                    $scope.updateOverSpeed();

                } else {
                    var points = {
                        lat: value.lat,
                        lng: value.lng,
                        icon: {
                            iconUrl: 'images/Circle_Blue.png',
                        },
                        time: value.devicetime,
                        riseOnHover: true,
                        opacity: 5,
                        riseOffset: 250
                    };

                    if(Math.abs(new Date(value.devicetime).getTime() - new Date($scope.busPosition[index+1].devicetime).getTime()) > 120000){
                        $scope.paths['p'+i] = {
                            color : '#478bf7',
                            weight : 4,
                            latlngs : latLng,
                            clickable : true
                        };
                        var delayTime = Math.abs(new Date(value.devicetime).getTime() - new Date($scope.busPosition[index+1].devicetime).getTime());
                        var diff=delayTime,milliseconds,seconds,minutes,hours,days;
                        // diff/=sign; // or diff=Math.abs(diff);
                        diff=(diff-(milliseconds=diff%1000))/1000;
                        diff=(diff-(seconds=diff%60))/60;
                        diff=(diff-(minutes=diff%60))/60;
                        days=(diff-(hours=diff%24))/24;
                        var numhours = Math.floor(((delayTime % 31536000) % 86400) / 3600);
                        var numminutes = Math.floor(delayTime % 60);
                        var numseconds = Math.floor(delayTime%60);
                        $scope.markers['timeDelayMarker_'+i] = {
                            lat: value.lat,
                            lng: value.lng,
                            icon: {
                                iconUrl: 'images/blackSpecialRed.png'
                            },
                            title: value.devicetime,
                            message: '<strong>Delay/BreakDown/Traffic!></strong>' + ' at '+ value.devicetime + ' For ' + hours + ' hours' + minutes+ ' minutes' + seconds + ' seconds',
                            riseOnHover: true,
                            opacity: 5,
                            riseOffset: 250,
                            move: true
                        };
                        latLng = [];
                        i++;
                    }else{
                        latLng.push(points);
                    }
                    var marker1 = L.marker([value.lat, value.lng], {time: value.devicetime,icon:greenIcon,clickable:true, riseOnHover:true})
                        .bindPopup(
                            '<strong>Time :' + value.devicetime+'</strong><br>'+
                            '<strong>Speed :' + (value.speed*1.852)+'</strong>'+
                            '<strong>Course :' + (value.course)+'</strong>'
                        );
                    marker1.on('add',function (event) {
                        leafletData.getMap('map').then(function (map) {
                            map.setView(marker1._latlng);
                        });
                    });
                    pointList.push(marker1);

                }

            });
        };

        $scope.updateOverSpeed = function () {

            var latLng = [];
            var i = 0;

            angular.forEach($scope.busPosition, function (value, index) {

                if((value.speed*1.852) > $scope.config.maxSpeed){
                    latLng.push(value);
                }else{
                    $scope.paths['OS'+i] = {
                        color : $scope.config.overSpeedColor,
                        weight : 4,
                        latlngs : latLng,
                        clickable : true
                    };
                    i++;
                    latLng = [];
                }

                if((index+1) == $scope.busPosition.length){
                    $scope.rashSpeed();
                }

            });

        };

        $scope.rashSpeed = function () {

            var latLng = [];
            var i = 0;
            var j = 0;

            angular.forEach($scope.busPosition, function (value, index) {

                if($scope.busPosition.length != (index+1) && index!=0 && value.speed != 0) {

                    if (latLng.length > 0) {
                        $scope.paths['rS' + j] = {
                            color: $scope.config.rashTurnColor,
                            weight: 4,
                            latlngs: latLng,
                            clickable: true
                        };
                        j++;
                        latLng = [];
                    }

                    if($scope.busPosition[index - 1].speed > 0 && $scope.busPosition[index + 1].speed > 0){
                        var courseAverage = (Math.abs($scope.busPosition[index - 1].course - (value.course)) + Math.abs(($scope.busPosition[index + 1].course)-value.course))/2;

                        // var courseAverage = Math.abs((($scope.busPosition[index - 1].course) + (value.course) + ($scope.busPosition[index + 1].course))/3);
                        // && ((value.speed*1.852) > Number($scope.config.rashTurnSpeed))
                        if (courseAverage >= 50 && courseAverage <= 90) {

                            var average = Math.abs((($scope.busPosition[index - 1].speed*1.852) + (value.speed*1.852) + ($scope.busPosition[index + 1].speed*1.852))/3);

                            if(average > Number($scope.config.rashTurnSpeed)){
                                if(index!=0){
                                    latLng.push($scope.busPosition[index - 1]);
                                }
                                latLng.push(value);
                                latLng.push($scope.busPosition[index + 1]);
                            }
                        }
                    }

                }
            });
            // rashTurnColor
        };

        $scope.clearMap=function(map) {
            var k = 0;
            for(i in map._layers) {
                if(k != 0) {
                    try {
                        map.removeLayer(map._layers[i]);
                        k++;
                    }
                    catch(e) {
                        console.log("problem with " + e + map._layers[i]);
                        k++;
                    }
                }else{
                    k++;
                }
            }
            $scope.legend = {
                position: 'topright',
                colors: [ $scope.config.overSpeedColor, $scope.config.rashTurnColor, '#478bf7'],
                labels: [ 'Over Speed', 'Rash Turn', 'Route Path' ]
            }
        };

        $scope.showDate = function () {
          // console.log($scope.selectedDate);
        };

        var pointsReduceAlgorithm = function (data) {

            var reducedData = [];

            angular.forEach(data,function (value,index) {

                if((index+1) != data.length){

                    if((value.lat != data[index+1].lat) && (value.lng != data[index+1].lng)){
                        reducedData.push(value);
                    }
                }else{
                    InvalidPointReduceAlgorithm(reducedData);
                }
            });

        };

        var InvalidPointReduceAlgorithm = function (data) {

            var reducedData = [];

            angular.forEach(data,function (value,index) {

                if((index+1)!=data.length){

                    var sum = value.lat + value.lng;
                    var nextSum = data[index+1].lat + data[index+1].lng;

                    if(Math.abs((sum - nextSum)) < 0.000800 || Math.abs((sum - nextSum)) > 0.000300){
                        reducedData.push(value);
                    }
                }else{
                    // distanceBasedAlgorithm(reducedData);
                    $scope.busPosition = reducedData;
                    $scope.updateMap();
                    $scope.center = {
                        lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                        lng: $scope.busPosition[$scope.busPosition.length - 1].lng,

                    };
                }

            });

        };

        var distanceBasedAlgorithm = function (data) {

            var reducedData = [];

            angular.forEach(data,function (value,index) {

                if((index+1)!=data.length){
                    var R = 6371e3;
                    var num = value.lat;
                    var slat = num.toFixed(8);
                    var num = value.lng;
                    var slng = num.toFixed(8);
                    var bl_lat = data[index+1].lat;
                    var bl_lng = data[index+1].lng;

                    var lat1 = slat * Math.PI / 180;
                    var lat2 = bl_lat * Math.PI / 180;
                    var lat = (bl_lat - slat) * Math.PI / 180;
                    var lng = (bl_lng - slng) * Math.PI / 180;
                    var a = Math.sin(lat / 2) * Math.sin(lat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(lng / 2) * Math.sin(lng / 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    var dis = (R * c);
                    if (dis > 30) {
                        reducedData.push(value);
                    }
                }else{
                    $scope.busPosition = reducedData;
                    $scope.updateMap();
                    $scope.center = {
                        lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                        lng: $scope.busPosition[$scope.busPosition.length - 1].lng,
                        zoom: 18
                    };
                }
            });

        };

        $scope.searchForBusPosition = function (fromTime,toTime,form) {
            $scope.getBusPositions($scope.currentBus,$scope.fromTime,$scope.toTime);
        };

        // $scope.getBusPositions(null,null);


    }
    
})();

