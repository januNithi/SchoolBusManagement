(function(){
    angular
        .module("myApp")
        .factory("eventReportService",eventReportService);

    eventReportService.$inject=[
        '$http'
    ];

    function eventReportService($http){
        return{

            getEvents:function(data){

                return $http({

                    method:'get',
                    url:'/report/eventReport?id='+data.device+'&from='+data.from+'&to='+data.to
                });
            }


        }
    }
})();