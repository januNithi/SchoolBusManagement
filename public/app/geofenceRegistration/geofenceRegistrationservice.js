(function(){
    angular
        .module("myApp")
        .factory("geofenceRegistrationService",geofenceRegistrationService);

    geofenceRegistrationService.$inject=[
        '$http'
    ];

    function geofenceRegistrationService($http){
        return{


            getGeofences:function(){
                
                return $http({
                    
                    method:'get',
                    url:'/dao/getGeofences'
                });
            },

            getGeofenceById:function(id){

                return $http({

                    method:'get',
                    url:'/dao/getGeofenceById/'+id
                });
            },
            postGeofenceData:function(data){

                return $http({

                    method:'post',
                    url:'/dao/geofenceData',
                    data:data

                });

            },
            deleteGeofence:function(id){

                return $http({

                    method:'delete',
                    url:'/dao/deleteGeofence/'+id

                });


                
            },
            updateGofence:function(data){

                alert("sdfsd");
            return $http({


                method:'put',
                url:'/dao/updateGeofence/'+data.id,
                data:data

            });

        },
            mapGeofenceToDevice:function(data){

                return $http({

                    method:'post',
                    url:'/dao/mapGeofences',
                    data:data

                });
        },
            getMapGeofenceDataById:function(id){

                return $http({

                    method:'get',
                    url:'/dao/getMapGeofenceById/'+id

                });
            }
    }
    }
})();