(function(){
    angular
        .module("myApp")
        .factory("gpsUnitRegistrationservice",gpsUnitRegistrationservice);

    gpsUnitRegistrationservice.$inject=[
        '$http'
    ];

    function gpsUnitRegistrationservice($http){
        return{

        }
    }
})();