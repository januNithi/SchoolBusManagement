(function(){
    angular
        .module("myApp")
        .controller("studentRegistrationController",studentRegistrationController);

    studentRegistrationController.$inject=[
        '$scope',
        '$window',
        'studentRegistrationService'


    ];

    function studentRegistrationController($scope,$window,studentRegistrationService){

        $scope.showSelectable = function (value) {

            if(value == 'student'){
                return 'selected';
            }

        }

    }
})();

