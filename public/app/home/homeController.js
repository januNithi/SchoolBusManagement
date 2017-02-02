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
        'loginService'

    ];

    function homeController($scope,$window,$filter,homeService,busRegistrationService,$timeout,leafletData,loginService){


        // var socket = io.connect();

        $scope.busData = [];
        $scope.currentBus = '1';
        $scope.paths = [];
        $scope.center = {};
        $scope.markers = {};
        $scope.selectedDate = '---- SELECT DATE ----';
        $scope.busPosition = [];
        var data=null;

        angular.extend($scope, {
            centerProperty: {
                lat: 11.015,
                lng: 76.96
            },
            zoomProperty: 8,
            clickedLatitudeProperty: null,
            clickedLongitudeProperty: null,
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
            }
        });

        $scope.showSelectable = function (value) {

            if(value == 'home'){
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

        $scope.getBusDetails = function () {
            busRegistrationService.getBusRegData().then(function (result) {
                $scope.busData = result.data;
            },function (error) {
                console.log(error);
            });
        };

        $scope.getBusPositions = function (id,date) {
            //$scope.clearMap();
            $scope.busPosition = [];
            $scope.paths = [];
            $scope.center = {};
            $scope.markers = [];
            $scope.point=[];

            homeService.getBusPosition(id,date).then(function (result) {



                // angular.forEach(result.data,function(value,index){
                //
                //     if ((index+1) != result.data.length) {
                //         var num = value.lat;
                //         var slat = num.toFixed(8);
                //         var num = value.lng;
                //         var slng = num.toFixed(8);
                //         var num = result.data[index + 1].lat;
                //         var bl_lat= num.toFixed(8);
                //         var num = result.data[index + 1].lng;
                //         var bl_lng =num.toFixed(8);
                //         var lats = (slat - bl_lat) * 10000;
                //         var lngs = (slng - bl_lng) * 10000;
                //         var latitude = lats.toFixed(4);
                //         var lngitude=lngs.toFixed(4);
                //         var lat=Math.abs(latitude);
                //         var lng=Math.abs(lngitude);
                //         // console.log(lat);
                //         // console.log(lng);
                //         if ((lat<4.5) && (lng<4.5)) {
                //             if((lat>0)&& (lng>0)) {
                //                 $scope.busPosition.push(value);
                //                 // console.log($scope.busPosition);
                //             }
                //
                //         }
                //
                //         // var lat1 = slat * Math.PI / 180;
                //         // var lat2 = bl_lat * Math.PI / 180;
                //         // var lat = (bl_lat - slat) * Math.PI / 180;
                //         // var lng = (bl_lng - slng) * Math.PI / 180;
                //         // var a = Math.sin(lat / 2) * Math.sin(lat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(lng / 2) * Math.sin(lng / 2);
                //         // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                //        // var dis = (R * c);
                //     //     if (dis > 20
                //     //     ) {
                //     //         $scope.busPosition.push(value);
                //     //         console.log($scope.busPosition);
                //     //
                //      }
                // });

                if(result.data.length > 0) {

                    $scope.busPosition = result.data;
                    pointsReduceAlgorithm();
                    $scope.selectedDate = $filter('date')(result.data[0].date, "yyyy-MM-dd");
                    $scope.busPosition;
                    $scope.updateMap();
                    $scope.center = {
                        lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                        lng: $scope.busPosition[$scope.busPosition.length - 1].lng,
                        zoom: 18
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
                iconUrl: 'images/blueSpecial.png'
            });
            angular.forEach($scope.busPosition, function (value, index) {

                if ((index + 1) == $scope.busPosition.length) {

                    $scope.markers = {
                        positionStart: {

                            lat:$scope.busPosition[0].lat,
                            lng:$scope.busPosition[0].lng,
                            iconSize: [38, 95],
                            time: "2013-01-22 10:24:59+01",
                            icon:{

                                iconUrl: 'images/school-bus.png',
                                color:'green'
                            },
                            title: value.devicetime,
                            message:'<strong>Start:></strong>'+'DeviceTime:'+new Date($scope.busPosition[0].devicetime).toLocaleString(),
                            riseOnHover: true,
                            opacity: 5,
                            riseOffset: 250,
                            move:true
                        },
                        positionEnd: {
                            lat: $scope.busPosition[$scope.busPosition.length-1].lat,
                            lng: $scope.busPosition[$scope.busPosition.length-1].lng,
                            iconSize: [38, 95],
                            icon:{

                                iconUrl: 'images/school-bus.png',
                                color:'green'
                            },
                            title: value.devicetime,
                            time: "2013-01-22 10:24:59+01",
                            message:'<strong>End:></strong>'+'DeviceTime:'+new Date($scope.busPosition[$scope.busPosition.length-1].devicetime).toLocaleString(),
                            riseOnHover: true,
                            opacity: 5,
                            riseOffset: 250,
                            move:true
                        }
                    };
                    $scope.paths = {
                        p1: {
                            color:'#478bf7',
                            weight: 4,
                            latlngs: $scope.busPosition
                        }

                    };
                    $scope.center = {
                        lat: value.lat,
                        lng: value.lng,
                        zoom: 18
                    };

                    leafletData.getMap('map').then(function (map) {

                        var marker1 = L.marker([value.lat, value.lng], {time: value.devicetime,icon: greenIcon});
                        // var pointA = new L.LatLng(value.lat, value.lng);
                        // var pointB = new L.LatLng($scope.busPosition[index+1].lat, $scope.busPosition[index+1].lng);
                        // var options = {
                        //     time : value.devicetime
                        // }
                        // var points = [pointA, pointB];
                        // points.options = options;
                        pointList.push(marker1);
                        if(map._controlContainer.children[1].children[1]){
                            map._controlContainer.children[1].children[1].remove();
                            $scope.clearMap(map);
                        }
                        layerGroup = L.layerGroup(pointList);
                        var sliderControl = L.control.sliderControl({layer:layerGroup, range:true});
                        map.addControl(sliderControl);
                        sliderControl.startSlider();
                    });

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

                    latLng.push(points);
                    var marker1 = L.marker([value.lat, value.lng], {time: value.devicetime,icon:greenIcon});
                    pointList.push(marker1);

                }

            });
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
        };

        $scope.showDate = function () {
          // console.log($scope.selectedDate);
        };

        var pointsReduceAlgorithm = function () {

            angular.forEach($scope.busPosition,function (value,index) {

                if((index+1)!=$scope.busPosition.length){

                    if((value.lat == $scope.busPosition[index+1].lat) && (value.lng == $scope.busPosition[index+1].lng)){
                        $scope.busPosition.splice(index,1);
                    }
                }else{
                    InvalidPointReduceAlgorithm();
                }
            });

        };

        var InvalidPointReduceAlgorithm = function () {

            angular.forEach($scope.busPosition,function (value,index) {

                if((index+1)!=$scope.busPosition.length){

                    var sum = value.lat + value.lng;
                    var nextSum = $scope.busPosition[index+1].lat + $scope.busPosition[index+1].lng;

                    if(Math.abs((sum - nextSum)) > 0.000800 || Math.abs((sum - nextSum)) < 0.000300){
                        $scope.busPosition.splice(index,1);
                    }
                }
            });

        };

        // var distanceBasedAlgorithm = function () {
        //
        //     angular.forEach($scope.busPosition,function (value,index) {
        //
        //         if((index+1)!=$scope.busPosition.length){
        //
        //             var num = value.lat;
        //             var slat = num.toFixed(8);
        //             var num = value.lng;
        //             var slng = num.toFixed(8);
        //
        //             var lat1 = slat * Math.PI / 180;
        //             var lat2 = bl_lat * Math.PI / 180;
        //             var lat = (bl_lat - slat) * Math.PI / 180;
        //             var lng = (bl_lng - slng) * Math.PI / 180;
        //             var a = Math.sin(lat / 2) * Math.sin(lat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(lng / 2) * Math.sin(lng / 2);
        //             var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        //             var dis = (R * c);
        //             if (dis < 20) {
        //                 $scope.busPosition.splice(index,1);
        //             }
        //         }
        //     });
        //
        // };

        $scope.searchForBusPosition = function () {
            $scope.getBusPositions($scope.currentBus,$filter('date')($scope.selectedDate, "yyyy-MM-dd"));
        };

        $scope.getBusPositions(null,null);

        $scope.getBusDetails();

    }
    
})();

