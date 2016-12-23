(function(){
    angular
        .module("myApp")
        .controller("tripRegistrationController",tripRegistrationController);

    tripRegistrationController.$inject=[
        '$scope',
        '$window',
        'tripRegistrationService',
        'busRegistrationService',
        'driverRegistrationService',
        'routeRegistrationService',
        'loginService'


    ];

    function tripRegistrationController($scope,$window,tripRegistrationService,busRegistrationService,driverRegistrationService,routeRegistrationService,loginService) {

        $scope.tripData = [];
        $scope.session = ['MORNING', 'AFTER-NOON', 'EVENING'];
        $scope.busRegData=[];
        $scope.driveData=[];
        $scope.routeData=[];
        $scope.curpage = 1;
        $scope.itemspage = 10;
        $scope.filteredDoc = [];
        $scope.maxSize = 4;
        $scope.totalItems = 0;
        

        $scope.showSelectable = function (value) {

            if (value == 'trip') {
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


        $scope.getTripRegDetails = function () {

            tripRegistrationService.getTripRegData().then(function (result) {

                $scope.tripData = result.data;
                $scope.totalItems = $scope.tripData.length;
                $scope.$watch('curpage + itemspage', function() {
                    var begin = (($scope.curpage - 1) * $scope.itemspage),
                        end = begin + $scope.itemspage;
                    $scope.filteredDoc = $scope.tripData.slice(begin, end);
                });

            });

        };
        $scope.getTripRegDetails();


        $scope.getBusRegDetails=function () {
            busRegistrationService.getBusRegData().then(function(result){

                $scope.busRegData=result.data;

            });
        };
        $scope.getBusRegDetails();
        $scope.getDirverData=function () {

            driverRegistrationService.getDriverDetails().then(function(result){

                $scope.driveData=result.data;

            });

        };
        $scope.getDirverData();

        $scope.getRouteData=function () {

            routeRegistrationService.getRoutes().then(function(result){

                $scope.routeData=result.data;

            });

        };
        $scope.getRouteData();

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

