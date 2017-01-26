/**
 * Created by CSS on 31-12-2016.
 */
(function(){
    angular
        .module("myApp")
        .service("dashboardService",dashboardService);

    dashboardService.$inject=[
        '$http'
    ];

    function dashboardService($http){
        return{

            getBusPosition : function (string) {

                return $http.get('/getMapPosition?'+string);

            }


        }
    }
})();