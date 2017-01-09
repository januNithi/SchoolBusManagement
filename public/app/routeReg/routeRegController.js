/**
 * Created by CSS on 31-12-2016.
 */
(function () {

    angular.module('myApp').controller('routeRegController',routeRegController);

    routeRegController.$inject = [
      '$scope',
        'leafletData',
        '$window',
        '$filter',
        'routeRegistrationService',
        'loginService'
    ];

    function routeRegController($scope,leafletData,$window,$filter,routeRegistrationService,loginService) {

        angular.extend($scope, {
            events: {
                map: {
                    enable: ['click', 'drag', 'blur', 'touchstart'],
                    logic: 'emit'
                }
            },
            tiles :{
                url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                options: {
                    attribution: "",
                    minZoom: 2,
                    maxZoom: 19
                }
            }
        });



        leafletData.getMap().then(function(map) {
            console.log("Make fit: ", map);
            console.log("Map Center:", map.getCenter());
            console.log("Map Bounds:", map.getBounds());
            map.fitBounds([
                [33.778175, 76.57617140000002],
                [8.0883064,77.5384507]]);
        });
        // $scope.makeFitFrom = function() {
        //     leafletData.getMap().then(function(map) {
        //
        //         if($scope.to && $scope.to.geometry && $scope.from && $scope.from.geometry){
        //             map.fitBounds([
        //                 [$scope.from.geometry.location.lat(),$scope.from.geometry.location.lng()],
        //                 [$scope.to.geometry.location.lat(),$scope.to.geometry.location.lng()]
        //             ]);
        //         }else if($scope.from && $scope.from.geometry){
        //             map.fitBounds([
        //                 [$scope.from.geometry.bounds.f.b,$scope.from.geometry.bounds.b.b],
        //                 [$scope.from.geometry.bounds.f.f,$scope.from.geometry.bounds.b.f]
        //             ]);
        //         }
        //     });
        // };
        // $scope.makeFitTo = function() {
        //     leafletData.getMap().then(function(map) {
        //
        //         if($scope.from && $scope.from.geometry && $scope.to && $scope.to.geometry){
        //             map.fitBounds([
        //                 [$scope.from.geometry.location.lat(),$scope.from.geometry.location.lng()],
        //                 [$scope.to.geometry.location.lat(),$scope.to.geometry.location.lng()]
        //             ]);
        //         }else if($scope.to && $scope.to.geometry){
        //             map.fitBounds([
        //                 [$scope.to.geometry.bounds.f.b,$scope.to.geometry.bounds.b.b],
        //                 [$scope.to.geometry.bounds.f.f,$scope.to.geometry.bounds.b.f]
        //             ]);
        //         }
        //
        //     });
        // };

        $scope.makeFitToMap = function (route) {
            leafletData.getMap().then(function(map) {

                map.fitBounds([
                    [route.fromRoutePoints.lat,route.fromRoutePoints.lng],
                    [route.toRoutePoints.lat,route.toRoutePoints.lng]
                ]);

            });
            $scope.routeData = route;
        };

        // $scope.from = '';
        // $scope.to = '';

        // $scope.$watch('from',function () {
        //     $scope.makeFitFrom();
        // });
        // $scope.$watch('to',function () {
        //     $scope.makeFitTo();
        // });

        // $scope.$apply(function () {
        //     if($scope.from.geometry) {
        //         $scope.makeFitFrom();
        //     }
        //     if($scope.to.geometry) {
        //         $scope.makeFitTo();
        //     }
        // });

    //    ***********************Map Bounds End***********************       //

        $scope.dt = new Date();

        $scope.routes = [];
        $scope.path = {};
        $scope.routeData = {
            stops:[]
        };

        $scope.stops = [];
        $scope.selectedRoute = {
            id:0
        };

        $scope.markers = [];
        $scope.markerData = {};

        $scope.center = {};
        $scope.paths ={};

        $scope.isFullscreen = false;

        $scope.showSelectable = function (value) {

            if(value == 'route'){
                return 'selected';
            }

        };

        loginService.isLoggedIn().then(function (result) {

            if(!result.data.id){
                loginService.goToLogin();
            }

        });

        $scope.onLogout = function () {
            loginService.onLogout().then(function () {
                loginService.goToLogin();
            });
        };


        $scope.$on("leafletDirectiveMap.click", function(event, args){
            var leafEvent = args.leafletEvent;

            $scope.markerData.lat = leafEvent.latlng.lat;
            $scope.markerData.lng = leafEvent.latlng.lng;


            angular.element('#markerCreator').trigger('click');

        });

        $scope.toggleFullScreen = function() {
            $scope.isFullscreen = !$scope.isFullscreen;
        };

        $scope.updateStop = function () {
            var latLng = [$scope.markerData.lat,$scope.markerData.lng];

            var stop = {
                stpName : $scope.markerData.stpName,
                stpTime :$filter('date')($scope.markerData.stpTime,'HH:mm:ss'),
                stpPosition : {
                    lat : $scope.markerData.lat,
                    lng :$scope.markerData.lng
                }
            };

            $scope.stops.push(stop);
            var time = $scope.markerData.stpTime;
            $scope.markerData.message = '<div class="panel panel-primary">' +
                '<div class="panel-heading">' +
                '<h1 class="panel-title">'+$scope.markerData.stpName+'</h1> ' +
                '</div>' +
                '<div class="panel-body">' +
                '<div class="well" style="color: white">' +
                '<div class="form-group">' +
                '<label>' +
                'Stop Timing:' +
                '</label> ' +
                '<label>'
                +$scope.markerData.stpTime +
                '</label>' +
                '</div> ' +
                '<div class="form-group">' +
                '<label>' +
                'Latitude:' +
                '</label> ' +
                '<label>'
                +$scope.markerData.lat +
                '</label>' +
                '</div> ' +
                '<div class="form-group">' +
                '<label>' +
                'Longitude:' +
                '</label> ' +
                '<label>'
                +$scope.markerData.lng +
                '</label>' +
                '</div> ' +
                '</div> ' +
                '</div> ' +
                '</div>';
            $scope.markers.push($scope.markerData);



            $scope.markerData = {};

        };

        var getRoutes = function () {
            routeRegistrationService.getRoutes().then(function (result) {
                $scope.routes = result.data;
                angular.forEach($scope.routes,function (value,index) {
                    if(value.fromRoutePoints != null) {
                        value.fromRoutePoints = JSON.parse(value.fromRoutePoints);
                        value.toRoutePoints = JSON.parse(value.toRoutePoints);
                    }
                    angular.forEach(value.stops,function (value1,index1) {
                        value1.stpPosition = JSON.parse(value1.stpPosition);
                    });

                });

            },function (error) {
                console.log(error);
            });
        };

        $scope.updateRoute = function () {

            $scope.routes.push($scope.routeData);

        };

        $scope.routeSelected = function (route,id) {
            $scope.from = '';
            $scope.to = '';
            $scope.selectedRow = id;
            // if($scope.selectedRow) {
            if(route.stops && route.stops.length) {
                $scope.stops = route.stops;
                $scope.path = {};
                $scope.markers = [];
                $scope.center = {};
                $scope.routeData = route;

                angular.forEach(route.stops, function (value, index) {
                    // var latLng = JSON.parse(value.stpPosition);

                    $scope.markerData = {
                        id: stop.id,
                        stpName: value.stpName,
                        stpTime: value.stpTime,
                        lat: value.stpPosition.lat,
                        lng: value.stpPosition.lng
                    };

                    $scope.center = {
                        lat: value.stpPosition.lat,
                        lng: value.stpPosition.lng,
                        zoom: 10
                    }

                    $scope.markerData.message = '<div class="panel panel-primary">' +
                        '<div class="panel-heading">' +
                        '<h1 class="panel-title">' + $scope.markerData.stpName + '</h1> ' +
                        '</div>' +
                        '<div class="panel-body">' +
                        '<div class="well" style="color: white">' +
                        '<div class="form-group">' +
                        '<label>' +
                        'Stop Timing:' +
                        '</label> ' +
                        '<label>'
                        + $scope.markerData.stpTime +
                        '</label>' +
                        '</div> ' +
                        '<div class="form-group">' +
                        '<label>' +
                        'Latitude:' +
                        '</label> ' +
                        '<label>'
                        + $scope.markerData.lat +
                        '</label>' +
                        '</div> ' +
                        '<div class="form-group">' +
                        '<label>' +
                        'Longitude:' +
                        '</label> ' +
                        '<label>'
                        + $scope.markerData.lng +
                        '</label>' +
                        '</div> ' +
                        '</div> ' +
                        '</div> ' +
                        '</div>';
                    $scope.markers.push($scope.markerData);

                    $scope.markerData = {};
                    if ((index + 1) == route.stops.length) {

                        // $scope.path = {
                        //     path: {
                        //         color: 'Green',
                        //         weight: 10,
                        //         latlngs: $scope.markers
                        //     }
                        // };
                    }

                });
            }else{
                $scope.makeFitToMap(route);
            }
            // }else{
            //     $scope.path = {};
            //     $scope.markers = [];
            //     $scope.center = {};
            //     $scope.routeData = {};
            //     $scope.stops = [];
            // }
        };

        $scope.showRoutes = function () {
            $scope.path = {};
            $scope.markers = [];
            $scope.center = {};
            $scope.routeData = {};
            $scope.stops = [];
            $scope.selectedRow = null;
        };

        $scope.updateRoutes = function (route) {

            var routeData = {};

            routeData.rtName = route;
            routeData.fromRoutePoints = {
                lat : $scope.from.geometry.location.lat(),
                lng : $scope.from.geometry.location.lng()
            };
            routeData.toRoutePoints = {
                lat : $scope.to.geometry.location.lat(),
                lng : $scope.to.geometry.location.lng()
            }

            $scope.saveRoutes(routeData);


        };

        $scope.saveRoutes = function (routes) {
            routeRegistrationService.updateRoutes(routes).then(function (result,err) {
                if(err){
                    console.log(err);
                }else{
                    $scope.markers = [];
                    $scope.path = {};
                    $scope.center = {};
                    $scope.selected = 0;
                    $scope.stops = [];
                    $scope.selectedRow = 0;
                    getRoutes();
                }
            });
        }

        $scope.updateStops = function () {
            $scope.routeData.stops = $scope.stops;
            $scope.saveRoutes($scope.routeData);
        }

        $scope.editStop = function (stop) {

            // var latLng = JSON.parse(stop.stpPosition);

            $scope.markerData ={
                id:stop.id,
                stpName : stop.stpName,
                stpTime : stop.stpTime,
                lat : stop.stpPosition.lat,
                lng : stop.stpPosition.lng
            };
            angular.element('#markerCreator').trigger('click');

        };

        $scope.editRoute = function (route) {

            // var latLng = JSON.parse(stop.stpPosition);

            $scope.routeData = route;
            angular.element('#routeCreator').trigger('click');

        };

        $scope.deleteStop = function (stop) {

            routeRegistrationService.deleteStops(stop).then(function (result,err) {

                if(err){
                    console.log(err);
                }else{
                    getRoutes();
                    alert("Successfully Deleted");
                }

            });

        };

        $scope.deleteRoute = function (route) {

            routeRegistrationService.deleteRoutes(route).then(function (result,err) {

                if(err){
                    console.log(err);
                }else{
                    getRoutes();
                    alert("Successfully Deleted");
                }

            });

        };

        $scope.close = function () {
            $scope.routeData = {};
            $scope.markerData = {};
        };

        getRoutes();



    }

})();