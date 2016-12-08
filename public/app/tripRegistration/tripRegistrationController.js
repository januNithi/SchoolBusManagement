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

    }
})();

