/**
 * Created by CSS on 23-12-2016.
 */

(function(){
    angular
        .module("myApp")
        .controller("chartReportController",chartReportController);

    chartReportController.$inject=[
        '$scope',
        '$window',
        '$filter',
        'busRegistrationService',
        'eventChartService'

    ];

    function chartReportController($scope,$window,$filter,busRegistrationService,eventChartService){


        $scope.selFrom;
        $scope.selTo;
        $scope.busList=[];
        $scope.selBus;

        // $scope.options = {legend: {display: true}};
        $scope.setFrom=function(str){
            $scope.selFrom=str;

        };

        $scope.setTo=function(str){
            $scope.selTo=str;

        };


        getBusRegDetails=function () {
            busRegistrationService.getBusRegData().then(function(result){
                $scope.busList=result.data;
                showDelayChart();
            },function(err){
                console.log(err);
            });
        };

        $scope.line={labels:[],series:'',data:[]};

        // $scope.line.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.line.series = [];
        $scope.line.data = [
            [65, 59, 80, 81, 56, 55],
            [28, 48, 40, 19, 86, 27]
        ];

        console.log("dd"+$scope.line.data);
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];//, { yAxisID: 'y-axis-2' }
        $scope.line.options = {
            scales: {
                yAxes: [
                    {
                        id: 'y-axis-1',
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    // {
                    //     id: 'y-axis-2',
                    //     type: 'linear',
                    //     display: true,
                    //     position: 'right'
                    // }
                ]
            }
        };

        $scope.labels = ['empty1','empty2'];
        $scope.data = [10,60];

        getEventsData=function(){


            var data={
                device:$scope.selBus.gpsUnit,
                from:$filter('date')(new Date($scope.selFrom),'yyyy-MM-dd HH:mm:ss'),
                to:$filter('date')(new Date($scope.selTo),'yyyy-MM-dd HH:mm:ss')
            };


            eventChartService.getEventChart(data).then(function(result){

                $scope.labels = [];
                $scope.data = [];
                console.log(result.data);
                for(i=0;i<result.data.length;i++){
                    $scope.labels.push(result.data[i].type);
                    $scope.data.push(result.data[i].timedifference);
                }

                console.log($scope.labels);
                console.log($scope.data);

            })
        };

        showDelayChart=function(){

            var d=new Date();
            d.setMonth(d.getMonth()-6);
            var data={
                from:$filter('date')(d,'yyyy-MM-dd HH:mm:ss'),
                to:$filter('date')(new Date(),'yyyy-MM-dd HH:mm:ss')
            };


            var locale = "en-us";
            for(i=0;i<=5;i++){
                var d2=new Date();
                d2.setMonth(d2.getMonth()-i);
                $scope.line.labels.push(d2.toLocaleString(locale, { month: "short",year: "numeric" }));
                // $scope.line.labels.push(d2.toLocaleString("mm/yyyy"));
            }



            console.log($scope.line.labels);
            // $scope.line.labels = ["January", "February", "March", "April", "May", "June", "July"];
            // $scope.line.series = ['Series A', 'Series B'];
            // $scope.line.data = [
            //     [65, 59, 80, 81, 56, 55, 40],
            //     [28, 48, 40, 19, 86, 27, 90]
            // ];
            console.log(data);

            eventChartService.getDelayChart(data).then(function(result){
                $scope.line.data = [];
                $scope.line.series=[];
                for(i=0;i<$scope.busList.length;i++){
                    var value=[];
                    $scope.line.series.push($scope.busList[i].busCode);
                    for(j=0;j<=5;j++){

                        var d3=new Date();
                        d3.setMonth(d3.getMonth()-(j));
                        for(k=0;k<result.data.length;k++){
                            if(($scope.busList[i].gpsUnit==result.data[k].gpsUnit) && (Number(d3.getMonth())+Number(1)==result.data[k].selMonth))
                                value.push(result.data[k].count);
                            else
                                value.push(0);
                        }



                    }

                    $scope.line.data=$scope.line.data.concat([value]);
                }


            })
        };

        $scope.showReport=function(){
            getEventsData();
        };

        getBusRegDetails();


    }

})();

