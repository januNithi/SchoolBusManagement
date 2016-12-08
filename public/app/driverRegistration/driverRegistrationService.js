(function(){
    angular
        .module("myApp")
        .factory("driverRegistrationService",driverRegistrationService);

    driverRegistrationService.$inject=[
        '$http'
    ];

    function driverRegistrationService($http){
        return{

        }
    }
})();