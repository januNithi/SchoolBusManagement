(function() {
    angular
        .module('myApp')
        .config(config);

    config.$inject = ['$routeProvider', '$locationProvider'];


    function config($routeProvider, $locationProvider) {
        $routeProvider

            .when('/', {
                controller: 'loginController',
                templateUrl: '../app/login/login.html'
            })
            .when('/busRegistration', {
                controller: 'busRegistrationController',
                templateUrl: '../app/busRegistration/busRegistration.html'
            });

        $locationProvider.html5Mode(true);
    }
})();
