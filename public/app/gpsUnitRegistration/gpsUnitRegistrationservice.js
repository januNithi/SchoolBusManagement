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
                });
            },
            postGpsUnitData:function(data){

                return $http({

                    method:'post',
                    url:'/post/gpsUnitData',
                    data:data

                });

            },
            deleteGpsUnitData:function(data){

                return $http({

                    method:'post',
                    url:'/post/deleteGpsUnitData',
                    data:{data:data.id}

                });


                
            },
            updateGpsUnitData:function(data){

            return $http({

                method:'post',
                url:'/post/updateGpsUnitData',
                data:data

            });



        }
        }
    }
})();