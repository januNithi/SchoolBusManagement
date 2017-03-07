/**
 * Created by CSS on 25-02-2017.
 */


(function(){
    angular
        .module("myApp")
        .controller("configController",configController);

    configController.$inject=[
        '$scope',
        '$window',
        'configService',
        'loginService'


    ];

    function configController($scope,$window,configService,loginService){

        $scope.config={};

        $scope.options = {
            format : 'hex'
        };

        $scope.showSelectable = function (value) {

            if(value == 'config'){
                return 'selected';
            }

        };

        loginService.isLoggedIn().then(function (result) {

            if(!result.data.id){
                loginService.goToLogin();
            }else{
                getConfigurationObject();
            }

        });

        $scope.onLogout = function () {
            loginService.onLogout().then(function () {
                loginService.goToLogin();
            });
        };

        var getConfigurationObject = function () {
            configService.getConfiguration().then(function (result) {
                $scope.config = result.data;
            },function (error) {
                console.log(error);
            });
        };

        $scope.updateConfiguration = function () {
            configService.updateConfiguration($scope.config).then(function (result) {
                if(result.status = "Success"){
                    alert("Successfully Updated");
                    getConfigurationObject();
                }
            },function (error) {
                console.log(error);
            });
        };
    }
})();

