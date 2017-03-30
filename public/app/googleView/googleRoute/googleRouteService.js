/**
 * Created by CSS on 24-03-2017.
 */
(function(){
    angular
        .module("myApp")
        .factory("googleMapService",googleMapService);

    googleMapService.$inject=[
        '$http'
    ];

    function googleMapService($http){
        return{

        }
    }
})();