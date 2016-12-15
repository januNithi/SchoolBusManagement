(function(){
    angular
        .module("myApp")
        .factory("driverRegistrationService",driverRegistrationService);

    driverRegistrationService.$inject=[
        '$http'
    ];

    function driverRegistrationService($http){
        return{
            postDriverDetail:function(data){
                var fd = new FormData();
                fd.append('id', data.id);
                fd.append('driverName', data.drvName);
                fd.append('mobNo',data.drvMob);

                if(data.drvLicence.length==1)
                {
                    fd.append('driverLicence', data.drvLicence[0]);

                }
                if(data.drvPhoto.length==1)
                {
                    fd.append('driverPhoto', data.drvPhoto[0]);

                }
                fd.append('driverLicence', data.drvLicence);
                fd.append('driverPhoto', data.drvPhoto);
                return $http({

                    method:'POST',
                    url:'/post/DriverDetail',
                    data:fd,
                    headers : {
                        'Content-Type' : undefined
                    },
                    transformRequest : angular.identity


                });


            },

            updateDriverDetail:function(data)
            {
                return $http({

                    method:'POST',
                    url:'/post/updateDriverDetail',
                    data:data
                });
                
            },
            getDriverDetails:function(){

                return $http({

                    method:'POST',
                    url:'/get/DriverDetail'
                   

                });
                
                
            },
            deleteDriverDetail:function(data){

                return $http({

                    method:'POST',
                    url:'/delete/DriverDetail',
                    data:{data:data.id}


                });
                
            }
        
        }
    }
})();