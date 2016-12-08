(function(){
    angular
        .module("myApp")
        .controller("driverRegistrationController",driverRegistrationController);

    driverRegistrationController.$inject=[
        '$scope',
        '$window',
        'driverRegistrationService'


    ];

    function driverRegistrationController($scope,$window,driverRegistrationService){

    }
})();

