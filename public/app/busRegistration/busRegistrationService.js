(function(){
    angular
        .module("myApp")
        .factory("busRegistrationService",busRegistrationService);

    busRegistrationService.$inject=[
        '$http'
    ];

    function busRegistrationService($http){
        return{

        }
    }
})();