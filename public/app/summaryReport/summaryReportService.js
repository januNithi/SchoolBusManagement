(function(){
    angular
        .module("myApp")
        .factory("summaryReportService",summaryReportService);

    summaryReportService.$inject=[
        '$http'
    ];

    function summaryReportService($http){
        return {


                getSummary:function(data){

                    return $http({

                        method:'get',
                        url:'/report/summaryReport?id='+data.device+'&from='+data.from+'&to='+data.to
                    });
                },
            exportSummary:function(data){

                return $http({

                    method:'get',
                    url:'/report/exportSummary?id='+data.device+'&from='+data.from+'&to='+data.to
                });
            }


        }
    }
})();