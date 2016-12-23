
    
    (function(){
        angular
            .module("myApp")
            .controller("loginController",loginController);

        loginController.$inject=[
            '$scope',
            '$window',
            'loginService'
        ];

        function loginController($scope,$window,loginService){

            $scope.userName = '';
            $scope.password = '';

            $scope.failMessage = '';
            $scope.errorMessage = '';

            loginService.isLoggedIn().then(function (result,err) {
                if(result.data.id){
                    loginService.goToDashboard();
                }

            });

            $scope.login = function () {
                $scope.failMessage = '';
                $scope.errorMessage = '';
                loginService.onLogin($scope.userName,$scope.password).then(function (result,err) {

                    if(result.data == 'success'){
                        loginService.goToDashboard();
                    }else if(result.data == 'failure'){
                        $scope.failMessage = 'Oops!! User Not Found';
                    }
                    if(err){
                        $scope.errorMessage = err.data;
                    }


                });
            };

            $scope.onLogout = function () {
                loginService.onLogout().then(function () {
                   loginService.goToLogin();
                });
            };
            
        }
    })();

