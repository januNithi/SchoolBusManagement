

(function(){
    angular
        .module("myApp")
        .factory("routeRegistrationService",routeRegistrationService);

    routeRegistrationService.$inject=[
        '$http'
    ];

    function routeRegistrationService($http){
        return{

            getRoutes : function () {
                return $http.get('/dao/getRoutes');
            },
            updateRoutes : function (data) {
                return $http.post('/dao/updateRoutes',data);
            },
            deleteRoutes : function (data) {
                return $http.post('/dao/deleteRoutes',data);
            },
            deleteStops : function (data) {
                return $http.post('/dao/deleteStops',data);
            }

        }
    }
})();