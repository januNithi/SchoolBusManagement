(function() {
    angular
        .module('myApp')
        .config(config)
        .constant('deviceOffline','images/redSpecial.png')
        .constant('deviceOnline','images/Circle_Green_small.png')
        .constant('deviceMoving','images/greendot.gif')
        .constant('deviceStopped','images/Circle_Orange_small.png')
        .constant('unknown','images/Circle_Yellow_small.png');

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
            .when('/mappedRoute',{
                controller: 'dashboardController',
                templateUrl: '../app/dashboard/dashboard.html'
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
                // controller: 'routeRegistrationController',
                // templateUrl: '../app/routeRegistration/routeRegistration.html'
                controller : 'routeRegController',
                templateUrl : '../app/routeReg/routeReg.html'
            })
            .when('/routePathCreation', {
                // controller: 'routeRegistrationController',
                // templateUrl: '../app/routeRegistration/routeRegistration.html'
                controller : 'roadPathCreationController',
                templateUrl : '../app/roadPathCreation/roadPathCreation.html'
            })
            .when('/reports', {
                controller: 'reportsController',
                templateUrl: '../app/reports/reports.html'
            })
            .when('/home', {
                controller: 'homeController',
                templateUrl: '../app/home/home.html'
            })
            .when('/settings', {
                controller: 'settingsController',
                templateUrl: '../app/settings/settings.html'
            })
            .when('/notification', {
                controller: 'notificationController',
                templateUrl: '../app/notification/notification.html'
            })
            .when('/parentNotification', {
                controller: 'parentNotificationController',
                templateUrl: '../app/parentNotification/parentNotification.html'
            })
            .when('/geofenceRegistration', {
                controller: 'geofenceRegistrationController',
                templateUrl: '../app/geofenceRegistration/geofenceRegistration.html'
            })
            .when('/eventReport', {
                controller: 'eventReportController',
                templateUrl: '../app/eventReport/eventReport.html'
            })
            .when('/summaryReport', {
                controller: 'summaryReportController',
                templateUrl: '../app/summaryReport/summaryReport.html'
            })
            .when('/studentReport', {
                controller: 'studentReportController',
                templateUrl: '../app/studentReport/studentReport.html'
            })
            .when('/jsReport', {
                controller: 'jsReportController',
                templateUrl: '../app/jsReport/jsReport.html'
            })
            .when('/chartReport', {
                controller: 'chartReportController',
                templateUrl: '../app/chartReport/chartReport.html'
            })
            .when('/configuration', {
                controller: 'configController',
                templateUrl: '../app/configuration/configuration.html'
            });

        $locationProvider.html5Mode(true);
    }
})();
