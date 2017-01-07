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


        var socket = io.connect();

        $scope.busData = [];
        $scope.currentBus = '1';
        $scope.paths = [];
        $scope.center = {};
        $scope.markers = {};
        $scope.selectedDate = '---- SELECT DATE ----';
        $scope.busPosition = [];
        var data=null;

        $scope.notify = false;
        $scope.notifyObj = {};

        $scope.map = L.map('map', {
            center: [11.0168, 76.9558],
            zoom: 13
        });

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap2525</a> contributors'
        }).addTo($scope.map);


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

        $scope.myChartObject = {};

        $scope.myChartObject.type = "PieChart";

        $scope.onions = [
            {v: "Bus On Time Start"},
            {v: 18},
        ];

        $scope.myChartObject.data = {"cols": [
            {id: "t", label: "Topping", type: "string"},
            {id: "s", label: "Slices", type: "number"}
        ], "rows": [
            {c: [
                {v: "Bus On Time Arrival"},
                {v: 15},
            ]},
            {c: $scope.onions},
            {c: [
                {v: "Bus Delay"},
                {v: 5}
            ]}
        ]};

        $scope.myChartObject.options = {
            'title': 'Bus Travel Reports'
        };

        $scope.popup2 = {
            opened: false
        };

        $scope.open2 = function() {
            $scope.popup2.opened = true;
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
            $scope.clearMap();
            $scope.busPosition = [];
            $scope.paths = [];
            $scope.center = {};
            $scope.markers = [];
            $scope.point=[];

            homeService.getBusPosition(id,date).then(function (result) {

                angular.forEach(result.data,function(value,index){
                    
                    if ((index+1) != result.data.length) {
                        var num = value.lat;
                        var slat = num.toFixed(8);
                        var num = value.lng;
                        var slng = num.toFixed(8);
                        var num = result.data[index + 1].lat;
                        var bl_lat= num.toFixed(8);
                        var num = result.data[index + 1].lng;
                        var bl_lng =num.toFixed(8);
                        var lats = (slat - bl_lat) * 10000;
                        var lngs = (slng - bl_lng) * 10000;
                        var latitude = lats.toFixed(4);
                        var lngitude=lngs.toFixed(4);
                        var lat=Math.abs(latitude);
                        var lng=Math.abs(lngitude);
                        console.log(lat);
                        console.log(lng);
                        if ((lat<4.5) && (lng<4.5)) {
                            if((lat>0)&& (lng>0)) {
                                $scope.busPosition.push(value);
                                console.log($scope.busPosition);
                            }

                        }

                        // var lat1 = slat * Math.PI / 180;
                        // var lat2 = bl_lat * Math.PI / 180;
                        // var lat = (bl_lat - slat) * Math.PI / 180;
                        // var lng = (bl_lng - slng) * Math.PI / 180;
                        // var a = Math.sin(lat / 2) * Math.sin(lat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(lng / 2) * Math.sin(lng / 2);
                        // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                       // var dis = (R * c);
                    //     if (dis > 20
                    //     ) {
                    //         $scope.busPosition.push(value);
                    //         console.log($scope.busPosition);
                    //
                     }
            });

                if(result.data.length > 0) {
                    $scope.selectedDate = $filter('date')(result.data[0].date, "yyyy-MM-dd");
                    $scope.busPosition;
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


            // $scope.roadMap=function()
            // {
            //
            //
            //
            //
            // };
            // $scope.roadMap();

        $scope.updateMap = function () {
            var data='';

            angular.forEach($scope.busPosition, function (value, index) {
            //
            //
            //    // if ((index + 1) == $scope.busPosition.length) {
            //         data += (value.lat + "," + value.lng + "|");
            //
            //     //}
            // });



                // data=data.substring(0,data.length-1);



                    // homeService.getRoadMap(data).then(function(result){
                    //
                    //     console.log(result.data.snappedPoints);
                    //     $scope.points1=[];
                    //     var latlon={};
                    //     angular.forEach(result.data.snappedPoints,function(value,index){
                    //
                    //         latlon={};
                    //
                    //         latlon.lat=value.location.latitude;
                    //         latlon.lng=value.location.longitude;


                                 //$scope.point.push.lat(value.location.latitude,value.location.longitude);


                            // }



                            var firstpolyline = new L.Polyline($scope.busPosition, {
                                color: '#e51010',
                                weight: 4,
                                opacity: 0.5,
                                smoothFactor: 1
                            });
                            firstpolyline.addTo($scope.map);

                            // var firstpolyline = new L.Polyline(latlong, {
                            //     color: '#e51010',
                            //     weight: 4,
                            //     opacity: 0.5,
                            //     smoothFactor: 1
                            // });
                            // firstpolyline.addTo($scope.map);

                            // $scope.points1.push(latlon);


                        // });


                        //
                        // var firstpolyline = new L.Polyline($scope.points1, {
                        //     color: '#e51010',
                        //     weight: 4,
                        //     opacity: 0.5,
                        //     smoothFactor: 1
                        // });
                        // firstpolyline.addTo($scope.map);
                        // var pathLine = L.polyline($scope.point).addTo($scope.map)
                        // var flightPath = new google.maps.Polyline({
                        //     path: $scope.point,
                        //     geodesic: true,
                        //     strokeColor: '#FF0000',
                        //     strokeOpacity: 1.0,
                        //     strokeWeight: 2
                        // });
                        //
                        // flightPath.setMap(map);


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
                                move: true
                            }

                        };


                    });


                    //
                    // var point = {
                    //     lat: Number(value.lat),
                    //     lng: Number(value.lng),
                    //     title: value.devicetime,
                    //     riseOnHover: true,
                    //     opacity: 5,
                    //     riseOffset: 250
                    // };
                    // path.push(point);

                    // L.Routing.control({
                    //     waypoints: [
                    //         L.latLng(11.635308, 77.22496),
                    //         L.latLng(11.984461, 77.70641)
                    //     ]
                    // }).addTo($scope.map);




                };
                // else {
                    //
                    // var pos=Math.abs(new Date(value.devicetime).getTime()-new Date($scope.busPosition[index + 1].devicetime).getTime());
                    //
                    // if(pos<=70000){
                    //     var point = {
                    //         lat: value.lat,
                    //         lng: value.lng,
                    //         title: value.devicetime,
                    //         riseOnHover: true,
                    //         opacity: 5,
                    //         riseOffset: 250
                    //     };
                    //     path.push(point);
                    // }
                   // else {
                        // var point = {
                        //     lat: value.lat,
                        //     lng: value.lng,
                        //     title: value.devicetime,
                        //     riseOnHover: true,
                        //     opacity: 5,
                        //     riseOffset: 250
                        // };
                        // path.push(value);
                        // var points = {
                        //     color: '#e51010',
                        //     weight: 4,
                        //     latlngs: path
                        // };
                        // var firstpolyline = new L.Polyline($scope.busPosition, {
                        //     color: '#e51010',
                        //     weight: 4,
                        //     opacity: 0.5,
                        //     smoothFactor: 1
                        // });
                        // firstpolyline.addTo($scope.map);

                        //$scope.paths['p'+i]=points;
                        // path=[];
                        // i++;

                        // L.Routing.control({
                        //     waypoints: [
                        //         L.latLng(value.lat, value.lng),
                        //         L.latLng($scope.busPosition[index+1].lat,$scope.busPosition[index+1].lng)
                        //     ]
                        // }).addTo($scope.map);

                    // }
                    // var points = {
                    //     lat: value.lat,
                    //     lng: value.lng,
                    //     icon: {
                    //         iconUrl: 'images/Circle_Blue.png',
                    //     },
                    //     title: value.devicetime,
                    //     riseOnHover: true,
                    //     opacity: 5,
                    //     riseOffset: 250
                    // }
                    // latLng.push(points);
               // }

                // console.log($scope.path);
                // $scope.paths.push($scope.path);

            //});


        //};

        $scope.clearMap=function() {
            for(i in $scope.map._layers) {
                if($scope.map._layers[i]._path != undefined) {
                    try {
                        $scope.map.removeLayer($scope.map._layers[i]);
                    }
                    catch(e) {
                        console.log("problem with " + e + $scope.map._layers[i]);
                    }
                }
            }
        };
        $scope.clearMap();

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
                lng: Number(data.lng),
                riseOnHover: true,
                opacity: 5,
                riseOffset: 250
            }
            $scope.busPosition.push(points);
            console.log(data.lat);
            console.log(data.lng);
            $scope.markers.marker.lat = Number(data.lat);
            $scope.markers.marker.lng = Number(data.lng);
            $scope.center.lat = Number(data.lat);
            $scope.center.lng = Number(data.lng);

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

        $scope.getBusPositions(null,null);

        $scope.getBusDetails();

    }
})();

