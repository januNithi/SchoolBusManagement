/**
 * Created by CSS on 08-12-2016.
 */
(function(){
    angular
        .module("myApp")
        .factory("homeService",homeService);

    homeService.$inject=[
        '$http'
    ];

    function homeService($http){
        return{

            getBusPosition : function (id,date) {

                return $http.get('/getMapPosition?id='+id+'&date='+date);

            }


        }
    }
})();