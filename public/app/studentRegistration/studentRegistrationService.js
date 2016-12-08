(function(){
    angular
        .module("myApp")
        .factory("studentRegistrationService",studentRegistrationService);

    studentRegistrationService.$inject=[
        '$http'
    ];

    function studentRegistrationService($http){
        return{

        }
    }
})();