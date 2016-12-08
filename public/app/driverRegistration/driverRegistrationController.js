(function(){
    angular
        .module("myApp")
        .controller("driverRegistrationController",driverRegistrationController);

    driverRegistrationController.$inject=[
        '$scope',
        '$window',
        'driverRegistrationService'


    ];

    function driverRegistrationController($scope,$window,driverRegistrationService){

        $scope.showSelectable = function (value) {

            if(value == 'driver'){
                return 'selected';
            }

        }

    }
})();

