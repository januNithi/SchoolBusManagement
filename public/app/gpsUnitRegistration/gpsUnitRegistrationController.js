(function(){
    angular
        .module("myApp")
        .controller("gpsUnitRegistrationController",gpsUnitRegistrationController);

    gpsUnitRegistrationController.$inject=[
        '$scope',
        '$window',
        'gpsUnitRegistrationservice'


    ];

    function gpsUnitRegistrationController($scope,$window,gpsUnitRegistrationservice){

    }
})();

