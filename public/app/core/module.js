angular.module('myApp',[
    'ngRoute',
    'googlechart',
    // 'leaflet-directive',
    'ngFileUpload',
    'ui.bootstrap',
    'ui-leaflet',
    'FBAngular',
    'chart.js',
    'angular-google-maps-geocoder',
    'color.picker',
    'ngMap',
    'ngMaterial'
],function($mdThemingProvider) {
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
});
