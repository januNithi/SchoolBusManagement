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
        'busRegistrationService'

    ];

    function homeController($scope,$window,$filter,homeService,busRegistrationService){


        var socket = io.connect();

        $scope.busData = [];
        $scope.currentBus = 0;
        $scope.paths = [];
        $scope.center = {};
        $scope.markers = {};
        $scope.selectedDate = '---- SELECT DATE ----';
        $scope.busPosition = [];

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

            homeService.getBusPosition(id,date).then(function (result) {
                if(result.data.length > 0) {
                    $scope.selectedDate = $filter('date')(result.data[0].date, "yyyy-MM-dd");
                    $scope.busPosition = result.data;
                    // $scope.updateMap();
                    $scope.markers = {
                        currentPosition: {
                            lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                            lng: $scope.busPosition[$scope.busPosition.length - 1].lng,
                            icon: {
                                iconUrl: 'images/bus.png',
                            },
                            iconSize: [38, 95],
                            title: $scope.busPosition[$scope.busPosition.length - 1].devicetime,
                            riseOnHover: true,
                            opacity: 5,
                            riseOffset: 250,
                            move:true
                        }
                    };

                    $scope.center = {
                        lat: $scope.busPosition[$scope.busPosition.length - 1].lat,
                        lng: $scope.busPosition[$scope.busPosition.length - 1].lng,
                        zoom: 18
                    };
                    $scope.currentBus = '1';
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
                            latlngs: latLng
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


        socket.on('bus position',function (data) {

            // var points = {
            //     lat: data.lat,
            //     lng: data.log,
            //     icon: {
            //         iconUrl: 'images/bus.png',
            //     },
            //     riseOnHover: true,
            //     opacity: 5,
            //     riseOffset: 250
            // }
            // $scope.busPosition.push(points);
            $scope.markers.currentPosition.lat = data.lat;
            $scope.markers.currentPosition.lng = data.log;

            $scope.$apply();
        });

        $scope.searchForBusPosition = function () {
            var obj = {
                date: $scope.busPosition[$scope.busPosition.length - 1].date,
                gpsUnit: $scope.busPosition[$scope.busPosition.length - 1].deviceid
            };
            socket.emit('stop track',obj);
            $scope.getBusPositions($scope.currentBus,$filter('date')($scope.selectedDate, "yyyy-MM-dd"));
        };

        $scope.getBusPositions(null,null);

        $scope.getBusDetails();

    }
})();

