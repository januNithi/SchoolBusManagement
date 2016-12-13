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
                fd.append('driverName', data.driverName);
                fd.append('driverLiscence', data.driverLiscence);
                fd.append('mobNo', data.mobNo);
                fd.append('file', data.file[0]);
                fd.append('file1',data.driverLiscence1[0]);
                return $http({

                    method:'POST',
                    url:'/post/DriverDetail',
                    data:fd,
                    headers : {
                        'Content-Type' : undefined
                    },
                    transformRequest : angular.identity


                });


            }
        }
    }
})();