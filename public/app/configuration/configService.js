/**
 * Created by CSS on 04-03-2017.
 */
(function(){
    angular
        .module("myApp")
        .factory("configService",configService);

    configService.$inject=[
        '$http'
    ];

    function configService($http){
        return{

            getConfiguration:function () {

                return $http({
                    method:'get',
                    url:'/config/getConfiguration'

                });

            },
            updateConfiguration:function (data) {

                return $http({
                    method:'post',
                    url:'/config/updateConfiguration',
                    data:data

                });

            }


        }
    }
})();