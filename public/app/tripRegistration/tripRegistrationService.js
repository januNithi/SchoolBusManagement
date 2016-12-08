(function(){
    angular
        .module("myApp")
        .factory("tripRegistrationService",tripRegistrationService);

    tripRegistrationService.$inject=[
        '$http'
    ];

    function tripRegistrationService($http){
        return{

        }
    }
})();