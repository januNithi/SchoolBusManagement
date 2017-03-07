(function(){
    angular
        .module("myApp")
        .factory("loginService",loginService);

    loginService.$inject=[
        '$http',
        '$window'
    ];

    function loginService($http,$window){
        return{
            isLoggedIn:function () {
                return $http.get('/api/isUserLoggedIn');
            },
            onLogin:function(userName,password){
                var userData = {
                    userName : userName,
                    password : password
                };
                return $http.post("/api/login",userData);
            },
            onLogout:function () {
                return $http.get("/api/logout");
            },
            goToDashboard : function () {
                $window.location.href = '/mappedRoute';
            },
            goToLogin : function () {
                $window.location.href = '/';
            }
        }
    }
})();