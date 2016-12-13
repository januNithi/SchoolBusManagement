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

        $scope.busData = [];
        $scope.currentBus = 1;
        $scope.paths = [];
        $scope.center = {};
        $scope.markers = [];
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
          
            homeService.getBusPosition(id,date).then(function (result) {
                $scope.selectedDate = $filter('date')(result.data[0].date, "dd-MM-yyyy");
                $scope.busPosition = result.data;
                var latLng = [];

                angular.forEach($scope.busPosition,function (value,index) {


                    if((index+1) == $scope.busPosition.length){
                        var points = {
                            lat :value.lat,
                            lng :value.lng,
                            title:value.servertime,
                            riseOnHover : true,
                            opacity : 5,
                            riseOffset : 250
                        }
                        latLng.push(points);
                        $scope.paths = {
                            p1 : {
                                color: 'red',
                                weight: 4,
                                latlngs:latLng
                            }

                        };
                        $scope.center = {
                            lat : value.lat,
                            lng : value.lng,
                            zoom : 18
                        };
                        var mark = {
                            lat :value.lat,
                            lng :value.lng,
                            icon: {
                                iconUrl: 'images/bus.png',
                            },
                            iconSize: [38, 95],
                            title:value.devicetime,
                            riseOnHover : true,
                            opacity : 5,
                            riseOffset : 250
                        }
                        $scope.markers.push(mark);

                    }else{
                        var points = {
                            lat :value.lat,
                            lng :value.lng,
                            icon: {
                                iconUrl: 'images/Circle_Blue.png',
                            },
                            title:value.devicetime,
                            riseOnHover : true,
                            opacity : 5,
                            riseOffset : 250
                        }
                        latLng.push(points);
                        $scope.markers.push(points);
                    }

                });


            },function (error) {
               console.log(error);
            });
            
        };

        $scope.showDate = function () {
          console.log($scope.selectedDate);
        };

        $scope.getBusPositions(null,null);

        $scope.getBusDetails();

    }
})();

