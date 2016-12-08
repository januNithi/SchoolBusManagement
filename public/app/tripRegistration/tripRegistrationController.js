(function(){
    angular
        .module("myApp")
        .controller("tripRegistrationController",tripRegistrationController);

    tripRegistrationController.$inject=[
        '$scope',
        '$window',
        'tripRegistrationService'


    ];

    function tripRegistrationController($scope,$window,tripRegistrationService){

        $scope.showSelectable = function (value) {

            if(value == 'trip'){
                return 'selected';
            }

        }

    }
})();

