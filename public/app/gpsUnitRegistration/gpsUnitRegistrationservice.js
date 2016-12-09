(function(){
    angular
        .module("myApp")
        .factory("gpsUnitRegistrationservice",gpsUnitRegistrationservice);

    gpsUnitRegistrationservice.$inject=[
        '$http'
    ];

    function gpsUnitRegistrationservice($http){
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