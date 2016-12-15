(function(){
    angular
        .module("myApp")
        .controller("tripRegistrationController",tripRegistrationController);

    tripRegistrationController.$inject=[
        '$scope',
        '$window',
        'tripRegistrationService',
        'busRegistrationService',
        'driverRegistrationService'


    ];

    function tripRegistrationController($scope,$window,tripRegistrationService,busRegistrationService,driverRegistrationService) {

        $scope.tripData = [];
        $scope.session = ['MORNING', 'AFTER-NOON', 'EVENING'];

        $scope.showSelectable = function (value) {

            if (value == 'trip') {
                return 'selected';
            }

        };
        $scope.getTripRegDetails = function () {

            tripRegistrationService.getTripRegData().then(function (result) {

                $scope.tripData = result.data;
                console.log($scope.tripData);

            });

        };
        $scope.getTripRegDetails();



        $scope.close = function () {
            $scope.trip = '';

        };

        $scope.Edit = function (data) {

            $scope.trip = data;

        };

        $scope.add = function (data) {

            $scope.data=data;

            tripRegistrationService.postTripRegDetails(data).then(function (result) {

                alert('Succesfully registered !!!');
                $scope.getTripRegDetails();
                $scope.trip='';
            });

        };

        $scope.delete = function (data) {

            tripRegistrationService.deleteTripRegDetails(data).then(function (result) {


                alert('delete registered !!!');
                $scope.getTripRegDetails();

            });

        };

    }

})();

