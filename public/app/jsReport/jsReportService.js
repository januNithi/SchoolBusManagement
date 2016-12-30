(function(){
    angular
        .module("myApp")
        .factory("jsReportService",jsReportService);

    jsReportService.$inject=[
        '$http'
    ];

    function jsReportService($http){
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