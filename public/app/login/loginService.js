(function(){
    angular
        .module("myApp")
        .factory("loginService",loginService);

    loginService.$inject=[
        '$http'
    ];

    function loginService($http){
        return{
            // onLogin:function(userModel){
        //         return $http.post("/api/login/",userModel);
        //     }
        }
    }
})();