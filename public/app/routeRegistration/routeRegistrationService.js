

(function(){
    angular
        .module("myApp")
        .factory("routeRegistrationService",routeRegistrationService);

    routeRegistrationService.$inject=[
        '$http'
    ];

    function routeRegistrationService($http){
        return{


        }
    }
})();