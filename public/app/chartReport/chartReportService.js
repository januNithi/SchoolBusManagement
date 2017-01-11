/**
 * Created by CSS on 23-12-2016.
 */
(function(){
    angular
        .module("myApp")
        .factory("eventChartService",eventChartService);

    eventChartService.$inject=[
        '$http'
    ];

    function eventChartService($http){
        return{

            getEventChart:function(data){

                return $http({

                    method:'get',
                    url:'/report/exportEventsChart?id='+data.device+'&from='+data.from+'&to='+data.to
                });
            },
            getDelayChart:function(data){

                return $http({

                    method:'get',
                    url:'/report/delayChart?from='+data.from+'&to='+data.to
                });
            }



        }
    }
})();