(function(){
    angular
        .module("myApp")
        .factory("busRegistrationService",busRegistrationService);

    busRegistrationService.$inject=[
        '$http'
    ];

    function busRegistrationService($http){
        return{

            getBusRegData:function () {

                return $http({
                    method:'post',
                    url:'/get/busRegDetails'

                });

            },
            addBusRegData:function (data) {

                return $http({
                    method:'post',
                    url:'/post/busRegDetails',
                    data:data

                });

            },
            deleteBusRegData:function (data) {
                return $http({
                    method:'post',
                    url:'/post/deleteBusRegDetails',
                    data:{data:data.id}

                });
            }


        }
    }
})();