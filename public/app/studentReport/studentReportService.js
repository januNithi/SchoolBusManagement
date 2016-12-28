(function(){
    angular
        .module("myApp")
        .factory("studentReportService",studentReportService);

    studentReportService.$inject=[
        '$http'
    ];

    function studentReportService($http){
        return {


            getReport:function(url){

                return $http({

                    method:'get',
                    url:'/report/studentReport?'+url
                });
            },

            getReportByName:function(name){

                return $http({

                    method:'get',
                    url:'/report/studentReportByName?stName='+name
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