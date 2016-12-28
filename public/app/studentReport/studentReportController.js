(function(){
    angular
        .module("myApp")
        .controller("studentReportController",studentReportController);

    studentReportController.$inject=[
        '$scope',
        'studentReportService',
        'busRegistrationService',
        'tripRegistrationService',
        'routeRegistrationService',
        '$filter',
        '$window'


    ];
    function studentReportController($scope,studentReportService,busRegistrationService,tripRegistrationService,routeRegistrationService,$filter,$window) {


        $scope.report=[];
        $scope.filteredReport=[];
        $scope.maxSize = 4;
        $scope.totalItems = 0;
        $scope.curpage = 1;
        $scope.itemspage = 10;

        $scope.busList=[];
        $scope.tripList=[];
        $scope.routeList=[];

        $scope.selBus;
        $scope.selTrip;
        $scope.selRoute;

        $scope.stName='';



        $scope.showReport=function(){
            loadReport();
        };


        $scope.showSelectable = function (value) {

            if(value == 'studentReport'){
                return 'selected';
            }

        };


        getBusRegDetails=function () {
            busRegistrationService.getBusRegData().then(function(result){
                $scope.busList=result.data;
            },function(err){
                console.log(err);
            });
        };

        getRouteDetails=function () {
            routeRegistrationService.getRoutes().then(function(result){
                $scope.routeList=result.data;
            },function(err){
                console.log(err);
            });
        };

        getTripDetails=function () {
            tripRegistrationService.getTripRegData().then(function(result){
                $scope.tripList=result.data;
            },function(err){
                console.log(err);
            });
        };

        $scope.exportReport=function(){

            var url='';

            url+=($scope.selBus==undefined) ?'busId=null':'busId='+$scope.selBus.id;
            url+=$scope.selTrip==undefined?'&tripId=null':'&tripId='+$scope.selTrip.id;
            url+=$scope.selRoute==undefined?'&routeId=null':'&routeId='+$scope.selRoute.id;

            $window.location.href="/report/exportStudentReport?"+url;
        };

        $scope.loadReportByStName=function(){

            if($scope.stName.length <=0){

                $scope.report=[];
                $scope.filteredReport=[];
                return;
            }


            studentReportService.getReportByName($scope.stName).then(function(result){

                $scope.report=result.data;

                $scope.totalItems = result.data.length;
                $scope.$watch('curpage + itemspage', function() {
                    var begin = (($scope.curpage - 1) * $scope.itemspage),
                        end = begin + $scope.itemspage;
                    $scope.filteredReport = $scope.report.slice(begin, end);

                });
            },function(err){
                console.log(err);
            })
        };
        loadReport=function(){

            var url='';

            url+=($scope.selBus==undefined) ?'busId=null':'busId='+$scope.selBus.id;
            url+=$scope.selTrip==undefined?'&tripId=null':'&tripId='+$scope.selTrip.id;
            url+=$scope.selRoute==undefined?'&routeId=null':'&routeId='+$scope.selRoute.id;


        studentReportService.getReport(url).then(function(result){

            $scope.report=result.data;

            $scope.totalItems = result.data.length;
            $scope.$watch('curpage + itemspage', function() {
                var begin = (($scope.curpage - 1) * $scope.itemspage),
                    end = begin + $scope.itemspage;
                $scope.filteredReport = $scope.report.slice(begin, end);

            });

        },function(err){

        })

        };

        Array.prototype.remove = function() {
            var what, a = arguments, L = a.length, ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };

        getBusRegDetails();
        getRouteDetails();
        getTripDetails();


    }
})();

