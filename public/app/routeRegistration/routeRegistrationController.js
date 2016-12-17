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
    }
})();

