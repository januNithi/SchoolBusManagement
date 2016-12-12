(function(){
    angular
        .module("myApp")
        .controller("tripRegistrationController",tripRegistrationController);

    tripRegistrationController.$inject=[
        '$scope',
        '$window',
        'tripRegistrationService'


    ];

    function tripRegistrationController($scope,$window,tripRegistrationService) {

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

        $scope.getTripRegTableDetails = function () {

            tripRegistrationService.getTripTableRegData().then(function (result) {

                $scope.tableData = result.data;


            });

        };
        $scope.getTripRegTableDetails();


        $scope.close = function () {
            $scope.trip = '';
        };

        $scope.Edit = function (data) {

            $scope.trip = data;

        };

        $scope.add = function (data) {

            tripRegistrationService.postTripRegDetails(data).then(function (result) {

                alert('Succesfully registered !!!');
                $scope.getTripRegTableDetails();
            });

        };

        $scope.delete = function (data) {

            tripRegistrationService.deleteTripRegDetails(data).then(function (result) {


                alert('delete registered !!!');
                $scope.getTripRegTableDetails();

            });

        };
        $scope.update = function (data) {

            tripRegistrationService.updateTripRegDetails(data).then(function (result) {
                alert('update Successfully !!!');
                $scope.getTripRegTableDetails();
            });
        }
    }

})();

