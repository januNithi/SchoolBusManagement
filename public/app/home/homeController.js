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

        // $scope.map = L.map('map', {
        //     center: [11.0168, 76.9558],
        //     zoom: 13
        // });

        // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap2525</a> contributors'
        // }).addTo($scope.map);


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
                },
                custom:[
                     {
                        player: {
                            transitionTime: 100,
                            loop: false,
                            startOver:true,
                        },
                        timeDimension: {
                            period: "PT5M",
                        },
                        position:      'bottomleft',
                        autoPlay:      true,
                        minSpeed:      1,
                        speedStep:     0.5,
                        maxSpeed:      15,
                        timeSliderDragUpdate: true,
                         addTo : function () {
                             
                         }
                    }

                ]
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

        function getCommonBaseLayers(map){
            var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            });
            var bathymetryLayer = L.tileLayer.wms("http://ows.emodnet-bathymetry.eu/wms", {
                layers: 'emodnet:mean_atlas_land',
                format: 'image/png',
                transparent: true,
                attribution: "EMODnet Bathymetry",
                opacity: 0.8
            });
            var coastlinesLayer = L.tileLayer.wms("http://ows.emodnet-bathymetry.eu/wms", {
                layers: 'coastlines',
                format: 'image/png',
                transparent: true,
                attribution: "EMODnet Bathymetry",
                opacity: 0.8
            });
            var bathymetryGroupLayer = L.layerGroup([bathymetryLayer, coastlinesLayer]);
            bathymetryGroupLayer.addTo(map);
            return {
                "EMODnet Bathymetry": bathymetryGroupLayer,
                "OSM": osmLayer
            };
        }

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
            //$scope.clearMap();
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
                        // console.log(lat);
                        // console.log(lng);
                        if ((lat<4.5) && (lng<4.5)) {
                            if((lat>0)&& (lng>0)) {
                                $scope.busPosition.push(value);
                                // console.log($scope.busPosition);
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

                    // var marker=L.marker([$scope.busPosition[0].lat,$scope.busPosition[0].lng],).addTo($scope.map);marker.bindPopup('hi').openPopup();

                    //
                    // $scope.markers = {
                    //     marker: {
                    //         lat: value.lat,
                    //         lng: value.lng,
                    //         lat:$scope.busPosition[0].lat,
                    //         lng:$scope.busPosition[0].lng,
                    //         icon: {
                    //             iconUrl: 'images/bus.png',
                    //             color:'green'
                    //         },
                    //
                    //         iconSize: [38, 95],
                    //         title: $filter('date')($scope.busPosition[$scope.busPosition.length - 1].devicetime, "dd-MM-yyyy h:mm:ss a"),
                    //         riseOnHover: true,
                    //         opacity: 5,
                    //         riseOffset: 250
                    //     }
                    // };


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
                    // var points = {
                    //     lat: value.lat,
                    //     lng: value.lng,
                    //     title: value.devicetime,
                    //     riseOnHover: true,
                    //     opacity: 5,
                    //     riseOffset: 250
                    // };
                    // latLng.push(points);
                    $scope.paths = {
                        p1: {
                            color:'#478bf7',
                            weight: 4,
                            latlngs: $scope.busPosition
                        }

                    };

                    leafletData.getMap('map').then(function(map){


                        
                    });
                    $scope.center = {
                        lat: value.lat,
                        lng: value.lng,
                        zoom: 18
                    };

                   

                    // var marker=L.marker([$scope.busPosition[0].lat,$scope.busPosition[0].lng]).addTo($scope.map);marker.bindPopup('hi').openPopup();
                    //
                    // var marker=L.marker([value.lat,value.lng]).addTo($scope.map);marker.bindPopup('hi').openPopup();
                    // var line = L.polyline([$scope.busPosition]).addTo($scope.map)


                    // var greenIcon = L.icon({
                    //             iconUrl: 'images/green.png',
                    //
                    //             iconSize:     [38, 95], // size of the icon
                    //             shadowSize:   [50, 64], // size of the shadow
                    //             iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                    //             shadowAnchor: [4, 62],  // the same for the shadow
                    //             popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                    //         });
                    // var pathLine = L.polyline($scope.busPosition,{icon: greenIcon}).addTo($scope.map);
                   // // var marker = L.marker([$scope.busPosition[0].lat,$scope.busPosition[0].lng]).addTo($scope.map);
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
                        },


                    }
                    leafletData.getMap('map').then(function (map) {

//                         var startDate = new Date();
//                         startDate.setUTCHours(0, 0, 0, 0);
//
//                         // var map = L.map('map', {
//                         //     zoom: 12,
//                         //     fullscreenControl: true,
//                         //     center: [39.3, 4]
//                         // });
//                         // map = L.map('map', {
//                         //     zoom: 12,
//                         //     fullscreenControl: true,
//                         //     center: [39.3, 4]
//                         // });
//
// // start of TimeDimension manual instantiation
//                         var timeDimension = new L.TimeDimension({
//                             period: "PT5M",
//                         });
// // helper to share the timeDimension object between all layers
//                         map.timeDimension = timeDimension;
// // otherwise you have to set the 'timeDimension' option on all layers.
//
//                         var player        = new L.TimeDimension.Player({
//                             transitionTime: 100,
//                             loop: false,
//                             startOver:true
//                         }, timeDimension);
//
//                         var timeDimensionControlOptions = {
//                             player:        player,
//                             timeDimension: timeDimension,
//                             position:      'bottomleft',
//                             autoPlay:      true,
//                             minSpeed:      1,
//                             speedStep:     0.5,
//                             maxSpeed:      15,
//                             timeSliderDragUpdate: true
//                         };
//
//                         var timeDimensionControl = new L.Control.TimeDimension(timeDimensionControlOptions);
//                         map.addControl(timeDimensionControl);
//
//                         var icon = L.icon({
//                             iconUrl: 'img/running.png',
//                             iconSize: [22, 22],
//                             iconAnchor: [5, 25]
//                         });
//
//                         var customLayer = L.geoJson(null, {
//                             pointToLayer: function (feature, latLng) {
//                                 if (feature.properties.hasOwnProperty('last')) {
//                                     return new L.Marker(latLng, {
//                                         icon: icon
//                                     });
//                                 }
//                                 return L.circleMarker(latLng);
//                             }
//                         });
//
//                         var gpxLayer = omnivore.gpx('data/running_mallorca.gpx', null, customLayer).on('ready', function() {
//                             map.fitBounds(gpxLayer.getBounds(), {
//                                 paddingBottomRight: [40, 40]
//                             });
//                         });
//
//                         var gpxTimeLayer = L.timeDimension.layer.geoJson(gpxLayer, {
//                             updateTimeDimension: true,
//                             addlastPoint: true,
//                             waitForReady: true
//                         });
//
//                         var kmlLayer = omnivore.kml('data/easy_currents_track.kml');
//                         var kmlTimeLayer = L.timeDimension.layer.geoJson(kmlLayer, {
//                             updateTimeDimension: true,
//                             addlastPoint: true,
//                             waitForReady: true
//                         });
//
//
//                         var overlayMaps = {
//                             "GPX Layer": gpxTimeLayer,
//                             "KML Layer": kmlTimeLayer
//                         };
//                         var baseLayers = getCommonBaseLayers(map); // see baselayers.js
//                         L.control.layers(overlayMaps).addTo(map);
//                         gpxTimeLayer.addTo(map);
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
                    }

                    latLng.push(points);

                }

            });



        }




        //
        // $scope.updateMap = function () {
        //     var latLng = [];
        //     angular.forEach($scope.busPosition, function (value, index) {
        //
        //         if ((index + 1) == $scope.busPosition.length) {
        //             // var points = {
        //             //     lat: value.lat,
        //             //     lng: value.lng,
        //             //     title: value.devicetime,
        //             //     riseOnHover: true,
        //             //     opacity: 5,
        //             //     riseOffset: 250
        //             // }
        //             // latLng.push(points);
        //             $scope.paths = {
        //                 p1: {
        //                     color: 'red',
        //                     weight: 4,
        //                     latlngs: $scope.busPosition
        //                 }
        //
        //             };
        //             $scope.center = {
        //                 lat: value.lat,
        //                 lng: value.lng,
        //                 zoom: 18
        //             };
        //             $scope.markers = {
        //                 currentPosition: {
        //                     lat: value.lat,
        //                     lng: value.lng,
        //                     icon: {
        //                         iconUrl: 'images/green.png',
        //                     },
        //                     iconSize: [38, 95],
        //                     title: value.devicetime,
        //                     riseOnHover: true,
        //                     opacity: 5,
        //                     riseOffset: 250,
        //                     move:true
        //                 }
        //             }

                // } else {
                //     var points = {
                //         lat: value.lat,
                //         lng: value.lng,
                //         icon: {
                //             iconUrl: 'images/Circle_Blue.png',
                //         },
                //         title: value.devicetime,
                //         riseOnHover: true,
                //         opacity: 5,
                //         riseOffset: 250
                //     }
                //     latLng.push(points);
               //  }

           // });
        //     var pathLine = L.polyline($scope.busPosition).addTo($scope.map);
        //     var greenIcon = L.icon({
        //         iconUrl: 'images/green.png',
        //
        //         iconSize:     [38, 95], // size of the icon
        //         shadowSize:   [50, 64], // size of the shadow
        //         iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        //         shadowAnchor: [4, 62],  // the same for the shadow
        //         popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        //     });
        //     var marker = L.marker([$scope.busPosition[0].lat,$scope.busPosition[0].lng],{icon: greenIcon}
        //     ).addTo($scope.map);
        //}


















            // $scope.roadMap=function()
            // {
            //
            //
            //
            //
            // };
            // $scope.roadMap();

        // $scope.updateMap = function () {
        //     var data='';
        //
        //     angular.forEach($scope.busPosition, function (value, index) {
        //
        //         var greenIcon = L.icon({
        //             iconUrl: 'images/green.png',
        //
        //             iconSize:     [38, 95], // size of the icon
        //             shadowSize:   [50, 64], // size of the shadow
        //             iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        //             shadowAnchor: [4, 62],  // the same for the shadow
        //             popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        //         });
        //         var marker = L.marker([$scope.busPosition[0].lat,$scope.busPosition[0].lng],{icon: greenIcon}
        //         ).addTo($scope.map);
        //         //marker.bindPopup('DeviceTime:'+new Date($scope.busPosition[0].devicetime).toLocaleString()).openPopup();
        //         //marker.valueOf()._icon.style.color = 'green'; //or any color
        //     //
        //     //    // if ((index + 1) == $scope.busPosition.length) {
        //     //         data += (value.lat + "," + value.lng + "|");
        //     //
        //     //     //}
        //     // });
        //
        //
        //
        //         // data=data.substring(0,data.length-1);
        //
        //
        //
        //             // homeService.getRoadMap(data).then(function(result){
        //             //
        //             //     console.log(result.data.snappedPoints);
        //             //     $scope.points1=[];
        //             //     var latlon={};
        //             //     angular.forEach(result.data.snappedPoints,function(value,index){
        //             //
        //             //         latlon={};
        //             //
        //             //         latlon.lat=value.location.latitude;
        //             //         latlon.lng=value.location.longitude;
        //
        //
        //                          //$scope.point.push.lat(value.location.latitude,value.location.longitude);
        //
        //
        //                     // }
        //
        //
        //
        //                     // var firstpolyline = new L.Polyline($scope.busPosition, {
        //                     //     color: '#e51010',
        //                     //     weight: 4,
        //                     //     opacity: 0.5,
        //                     //     smoothFactor: 1
        //                     // });
        //                     // firstpolyline.addTo($scope.map);
        //
        //         // var firstpolyline = new L.Polyline($scope.busPosition, {
        //         //     color: '#e51010',
        //         //     weight: 4,
        //         //     opacity: 0.5,
        //         //     smoothFactor: 1
        //         // });
        //         // firstpolyline.addTo($scope.map);
        //         var pathLine = L.polyline($scope.busPosition).addTo($scope.map)
        //
        //                     // var firstpolyline = new L.Polyline(latlong, {
        //                     //     color: '#e51010',
        //                     //     weight: 4,
        //                     //     opacity: 0.5,
        //                     //     smoothFactor: 1
        //                     // });
        //                     // firstpolyline.addTo($scope.map);
        //
        //                     // $scope.points1.push(latlon);
        //
        //
        //                 // });
        //
        //
        //                 //
        //                 // var firstpolyline = new L.Polyline($scope.points1, {
        //                 //     color: '#e51010',
        //                 //     weight: 4,
        //                 //     opacity: 0.5,
        //                 //     smoothFactor: 1
        //                 // });
        //                 // firstpolyline.addTo($scope.map);
        //                 // var pathLine = L.polyline($scope.point).addTo($scope.map)
        //                 // var flightPath = new google.maps.Polyline({
        //                 //     path: $scope.point,
        //                 //     geodesic: true,
        //                 //     strokeColor: '#FF0000',
        //                 //     strokeOpacity: 1.0,
        //                 //     strokeWeight: 2
        //                 // });
        //                 //
        //                 // flightPath.setMap(map);
        //
        //                 //
        //                 // $scope.center = {
        //                 //     lat: value.lat,
        //                 //     lng: value.lng,
        //                 //     zoom: 18
        //                 // };
        //                 // $scope.markers = {
        //                 //     currentPosition: {
        //                 //         lat: value.lat,
        //                 //         lng: value.lng,
        //                 //         icon: {
        //                 //             iconUrl: 'images/bus.png',
        //                 //         },
        //                 //         iconSize: [38, 95],
        //                 //         title: value.devicetime,
        //                 //         riseOnHover: true,
        //                 //         opacity: 5,
        //                 //         riseOffset: 250,
        //                 //         move: true
        //                 //     }
        //
        //                 // };
        //
        //
        //             });
        //
        //
        //             //
        //             // var point = {
        //             //     lat: Number(value.lat),
        //             //     lng: Number(value.lng),
        //             //     title: value.devicetime,
        //             //     riseOnHover: true,
        //             //     opacity: 5,
        //             //     riseOffset: 250
        //             // };
        //             // path.push(point);
        //
        //             // L.Routing.control({
        //             //     waypoints: [
        //             //         L.latLng(11.635308, 77.22496),
        //             //         L.latLng(11.984461, 77.70641)
        //             //     ]
        //             // }).addTo($scope.map);
        //
        //
        //
        //
        //         };
        //         // else {
        //             //
        //             // var pos=Math.abs(new Date(value.devicetime).getTime()-new Date($scope.busPosition[index + 1].devicetime).getTime());
        //             //
        //             // if(pos<=70000){
        //             //     var point = {
        //             //         lat: value.lat,
        //             //         lng: value.lng,
        //             //         title: value.devicetime,
        //             //         riseOnHover: true,
        //             //         opacity: 5,
        //             //         riseOffset: 250
        //             //     };
        //             //     path.push(point);
        //             // }
        //            // else {
        //                 // var point = {
        //                 //     lat: value.lat,
        //                 //     lng: value.lng,
        //                 //     title: value.devicetime,
        //                 //     riseOnHover: true,
        //                 //     opacity: 5,
        //                 //     riseOffset: 250
        //                 // };
        //                 // path.push(value);
        //                 // var points = {
        //                 //     color: '#e51010',
        //                 //     weight: 4,
        //                 //     latlngs: path
        //                 // };
        //                 // var firstpolyline = new L.Polyline($scope.busPosition, {
        //                 //     color: '#e51010',
        //                 //     weight: 4,
        //                 //     opacity: 0.5,
        //                 //     smoothFactor: 1
        //                 // });
        //                 // firstpolyline.addTo($scope.map);
        //
        //                 //$scope.paths['p'+i]=points;
        //                 // path=[];
        //                 // i++;
        //
        //                 // L.Routing.control({
        //                 //     waypoints: [
        //                 //         L.latLng(value.lat, value.lng),
        //                 //         L.latLng($scope.busPosition[index+1].lat,$scope.busPosition[index+1].lng)
        //                 //     ]
        //                 // }).addTo($scope.map);
        //
        //             // }
        //             // var points = {
        //             //     lat: value.lat,
        //             //     lng: value.lng,
        //             //     icon: {
        //             //         iconUrl: 'images/Circle_Blue.png',
        //             //     },
        //             //     title: value.devicetime,
        //             //     riseOnHover: true,
        //             //     opacity: 5,
        //             //     riseOffset: 250
        //             // }
        //             // latLng.push(points);
        //        // }
        //
        //         // console.log($scope.path);
        //         // $scope.paths.push($scope.path);
        //
        //     //});
        //
        //
        // //};
        //
        // $scope.clearMap=function() {
        //     for(i in $scope.map._layers) {
        //         if($scope.map._layers[i]._path != undefined) {
        //             try {
        //                 $scope.map.removeLayer($scope.map._layers[i]);
        //             }
        //             catch(e) {
        //                 console.log("problem with " + e + $scope.map._layers[i]);
        //             }
        //         }
        //     }
        // };
        // $scope.clearMap();

        $scope.showDate = function () {
          // console.log($scope.selectedDate);
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
            // console.log(data.lat);
            // console.log(data.lng);
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

