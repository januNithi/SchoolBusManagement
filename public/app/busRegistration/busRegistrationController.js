

(function(){
    angular
        .module("myApp")
        .controller("busRegistrationController",busRegistrationController);

    busRegistrationController.$inject=[
        '$scope',
        '$window',
        'busRegistrationService'


    ];

    function busRegistrationController($scope,$window,busRegistrationService){
        
        $scope.showSelectable = function (value) {

            if(value == 'bus'){
                return 'selected';
            }

        }
    }
})();

