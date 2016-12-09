(function(){
    angular
        .module("myApp")
        .factory("gpsUnitRegistrationService",gpsUnitRegistrationService);

    gpsUnitRegistrationService.$inject=[
        '$http'
    ];

    function gpsUnitRegistrationService($http){
        return{


            getGpsUnitData:function(){
                
                return $http({
                    
                    method:'post',
                    url:'/get/gpsUnitData'
                })
            }
            
        }
    }
})();