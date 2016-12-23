(function(){
    angular
        .module("myApp")
        .controller("routeRegistrationController",routeRegistrationController);

    routeRegistrationController.$inject=[
        '$scope',
        '$window',
        '$filter',
        'routeRegistrationService',
        'loginService'


    ];

    function routeRegistrationController($scope,$window,$filter,routeRegistrationService,loginService)
    {
        $scope.dt = new Date();

        $scope.routes = [];
        $scope.path = {};
        $scope.routeData = {
            stops:[]
        };
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


        $scope.utcToLocal = function(utcDateString) {
            if (!utcDateString) {
                return;
            }

            // append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
            if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
                utcDateString += 'Z';
            }

            return $filter('date')(utcDateString, 'HH:mm');
        };

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
                        maxZoom: 21
                    }
            }
        });

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

            $scope.routeData.stops.push(stop);
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

        $scope.routeSelected = function (route,selected) {
            if(selected) {
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
                $scope.path = {};
                $scope.markers = [];
                $scope.center = {};
                $scope.routeData = {};
            }
        };

        $scope.updateRoutes = function (route) {

            routeRegistrationService.updateRoutes(route).then(function (result,err) {
                if(err){
                    console.log(err);
                }else{
                    $scope.markers = [];
                    $scope.path = {};
                    $scope.center = {};
                    getRoutes();
                }
            });

        };

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

