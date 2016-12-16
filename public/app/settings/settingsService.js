/**
 * Created by CSS on 08-12-2016.
 */
(function(){
    angular
        .module("myApp")
        .factory("settingsService",settingsService);

    settingsService.$inject=[
        '$http'
    ];

    function settingsService($http){
        return{
            // onLogin:function(userModel){
            //         return $http.post("/api/login/",userModel);
            //     }
        }
    }
})();