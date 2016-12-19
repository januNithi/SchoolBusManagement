(function(){
    angular
        .module("myApp")
        .controller("routeRegistrationController",routeRegistrationController);

    routeRegistrationController.$inject=[
        '$scope',
        '$window',
        'routeRegistrationService'


    ];

    function routeRegistrationController($scope,$window,routeRegistrationService)
    {
        $scope.dt = new Date();

        $scope.markers = {};

        $scope.center = {};
        $scope.paths ={};

        $scope.showSelectable = function (value) {

            if(value == 'route'){
                return 'selected';
            }

        };

        $scope.$on("leafletDirectiveMap.click", function(event, args){
            var leafEvent = args.leafletEvent;
            $scope.markers.push({
                lat: leafEvent.latlng.lat,
                lng: leafEvent.latlng.lng,
                message: "My Added Marker"
            });
        });

    }
})();

