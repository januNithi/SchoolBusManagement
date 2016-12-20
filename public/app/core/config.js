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
            })
            .when('/driverRegistration', {
                controller: 'driverRegistrationController',
                templateUrl: '../app/driverRegistration/driverRegistration.html'
            })
            .when('/gpsUnitRegistration', {
                controller: 'gpsUnitRegistrationController',
                templateUrl: '../app/gpsUnitRegistration/gpsUnitRegistration.html'
            })
            .when('/studentRegistration', {
                controller: 'studentRegistrationController',
                templateUrl: '../app/studentRegistration/studentRegistration.html'
            })
            .when('/tripRegistration', {
                controller: 'tripRegistrationController',
                templateUrl: '../app/tripRegistration/tripRegistration.html'
            })
            .when('/route', {
                controller: 'routeRegistrationController',
                templateUrl: '../app/routeRegistration/routeRegistration.html'
            })
            .when('/home', {
                controller: 'homeController',
                templateUrl: '../app/home/home.html'
            })
            .when('/settings', {
                controller: 'settingsController',
                templateUrl: '../app/settings/settings.html'
            })
            .when('/geofenceRegistration', {
                controller: 'geofenceRegistrationController',
                templateUrl: '../app/geofenceRegistration/geofenceRegistration.html'
            })
        ;

        $locationProvider.html5Mode(true);
    }
})();
