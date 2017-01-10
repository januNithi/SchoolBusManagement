(function(){
    angular
        .module("myApp")
        .controller("summaryReportController",summaryReportController);

    summaryReportController.$inject=[
        '$scope',
        'summaryReportService',
        'busRegistrationService',
        '$filter',
        '$window'


    ];
    function summaryReportController($scope,summaryReportService,busRegistrationService,$filter,$window) {


        $scope.map;


        $scope.summary=[];
        $scope.filteredSummary=[];
        $scope.maxSize = 4;
        $scope.totalItems = 0;
        $scope.curpage = 1;
        $scope.itemspage = 10;

        $scope.busList=[];
        $scope.selDevice=[];
        $scope.selBus;
        $scope.selFrom;
        $scope.selTo;



        $scope.selectDevice=function() {
            var flag = false;
            for (i = 0; i < $scope.selDevice.length; i++) {
                if ($scope.selBus.id == $scope.selDevice[i].id) {
                    flag = true;
                    break;
                }
                else
                    flag=false;

            }

            if (!flag)
                $scope.selDevice.push($scope.selBus);


        };

        $scope.setFrom=function(str){
            $scope.selFrom=str;

        };

        $scope.setTo=function(str){
            $scope.selTo=str;

        };


        $scope.showSelectable = function (value) {

            if(value == 'summaryReport'){
                return 'selected';
            }

        };

        $scope.removeDevice=function (index) {
            $scope.selDevice.splice(index,1);
        };

        $scope.showReport=function(){

            if($scope.selDevice.length <=0) {
                alert("Please select Bus Details!!");
                return;
            }
            loadSummary($scope.selDevice,$scope.selFrom,$scope.selTo);
        };


        $scope.exportSummary=function(){

            var data={
                device:$scope.selDevice,
                from:$filter('date')($scope.selFrom,'yyyy-MM-dd HH:mm:ss'),
                to:$filter('date')($scope.selTo,'yyyy-MM-dd HH:mm:ss')
            };

            $window.location.href="/report/exportSummary?id="+data.device +"&from="+data.from+"&to="+data.to;
        };


        getBusRegDetails=function () {
            busRegistrationService.getBusRegData().then(function(result){
                $scope.busList=result.data;
            },function(err){
                console.log(err);
            });
        };

        loadSummary=function(id,from,to){

            from=new Date(from);
            to=new Date(to);

            var data={
                device:JSON.stringify($scope.selDevice),
                from:$filter('date')(from,'yyyy-MM-dd HH:mm:ss'),
                to:$filter('date')(to,'yyyy-MM-dd HH:mm:ss')

            };
            summaryReportService.getSummary(data).then(function(result){

                $scope.summary=result.data;

                $scope.totalItems = result.data.length;
                $scope.$watch('curpage + itemspage', function() {
                    var begin = (($scope.curpage - 1) * $scope.itemspage),
                        end = begin + $scope.itemspage;
                    $scope.filteredSummary = $scope.summary.slice(begin, end);

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

    }
})();

