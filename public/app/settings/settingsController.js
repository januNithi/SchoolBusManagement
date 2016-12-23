/**
 * Created by CSS on 08-12-2016.
 */


(function(){
    angular
        .module("myApp")
        .controller("settingsController",settingsController);

    settingsController.$inject=[
        '$scope',
        '$window',
        'loginService'


    ];

    function settingsController($scope,$window,loginService){

        $scope.showSelectable = function (value) {

            if(value == 'settings'){
                return 'selected';
            }

        };
        loginService.isLoggedIn().then(function (result) {

            if(!result.data.id){
                loginService.goToLogin();
            }

        });

        $scope.onLogout = function () {
            loginService.onLogout().then(function () {
                loginService.goToLogin();
            });
        };




        $scope.accordionGroupOptions1={
            open:true
        };
        $scope.accordionGroupOptions2={
            open:true
        };
        $scope.accordionGroupOptions3={
            open:true
        };
        $scope.accordionGroupOptions4={
            open:true
        };
        $scope.accordionGroupOptions5={
            open:true
        };
        $scope.accordionGroupOptions6={
            open:true
        };
        $scope.simpleAccordionOptions = {
            closeOthers: false
        };

    }
})();

