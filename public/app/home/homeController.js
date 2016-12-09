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
        'homeService',
        'busRegistrationService'


    ];

    function homeController($scope,$window,homeService,busRegistrationService){

        $scope.busData = [];
        $scope.currentBus = 1;

        angular.extend($scope, {
            centerProperty: {
                lat: 11.015,
                lng: 76.96
            },
            zoomProperty: 8,
            markersProperty: [ {
                latitude: 11.015,
                longitude: 76.96
            }],
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

        $scope.getBusDetails();

    }
})();

