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
        'loginService',
        '$filter'


    ];

    function tripRegistrationController($scope,$window,tripRegistrationService,busRegistrationService,driverRegistrationService,routeRegistrationService,loginService,$filter) {

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

        $scope.stops = [];

        $scope.trip={
            drvId:0,
            rtId:0,
            busId:0,
            start:0,
            End:0

        };

        $scope.showSelectable = function (value) {

            if (value == 'trip') {
                return 'selected';
            }

        };

        $scope.showSettings = function (value) {

            return true;

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
            $scope.trip={
                drvId:0,
                rtId:0,
                busId:0,
                Start:0,
                End:0

            };
            $scope.stops = [];
        };

        $scope.getStops = function () {

            angular.forEach($scope.routeData, function (value, index) {

                if (value.id == $scope.trip.rtId) {

                    $scope.stops = value.stops;

                    $scope.trip.stops = $scope.stops;

                    angular.forEach($scope.stops, function (value, index) {

                        if ($scope.trip['stop_' + value.id]) {
                            $scope.trip['stop_' + value.id] = new Date("2016-12-31 " + $scope.trip['stop_' + value.id]);
                        }

                    });

                }

            });

        };

        $scope.showStops = function (data) {

           angular.forEach($scope.filteredDoc,function (value,index) {

               if(data.id == value.id){
                   value.showStops = true;
               }else{
                   value.showStops = false;
               }

           });

        };
        
        $scope.showValue = function (data,stop) {
          
            return stop.stpName + ':' + data['stop_'+stop.id];
            
        };

        $scope.Edit = function (data) {
            // $scope.getTripRegDetails();
            $scope.trip = data;
            $scope.trip.trpStart =new Date("2016-12-31 "+  data.trpStart);
            $scope.trip.trpEnd = new Date("2016-12-31 " + data.trpEnd);
            $scope.getStops();

            // var trpStart=angular.isString(data.trpStart);
            // var trpEnd=angular.isString(data.trpEnd);
            // if(trpStart==false) {
            //     $scope.trip.trpStart = new Date("2016-12-31 " + data.trpStart).toTimeString();
            // }
            // else {
            //     $scope.trip.trpStart = new Date("2016-12-31 " + data.trpStart);
            //
            //
            //
            // }
            // if(trpEnd==false) {
            //     $scope.trip.trpEnd = new Date("2016-12-31 " + data.trpEnd).toTimeString();
            // }
            // else {
            //
            //     $scope.trip.trpEnd = new Date("2016-12-31 " + data.trpEnd);
            //
            // }

        };

        $scope.add = function (data) {
            $scope.data=data;
            $scope.data.trpStart=$filter('date')(data.trpStart,'HH:mm:ss');
            $scope.data.trpEnd=$filter('date')(data.trpEnd,'HH:mm:ss');
            angular.forEach($scope.stops,function (value,index) {

                if($scope.data['stop_'+value.id]) {
                    $scope.data['stop_' + value.id] = $filter('date')(data['stop_' + value.id],'HH:mm:ss');
                }

            });
            $scope.data.stops = $scope.stops;
            // $scope.data[stops = $scope.stops;
            tripRegistrationService.postTripRegDetails($scope.data).then(function (result) {

                alert('Succesfully registered !!!');
                $scope.getTripRegDetails();
                $scope.trip={
                    drvId:0,
                    rtId:0,
                    busId:0,
                    start:0,
                    End:0
                };
                $scope.stops = [];
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

