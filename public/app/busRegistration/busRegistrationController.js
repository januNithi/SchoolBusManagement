

(function(){
    angular
        .module("myApp")
        .controller("busRegistrationController",busRegistrationController);

    busRegistrationController.$inject=[
        '$scope',
        '$window',
        'busRegistrationService',
        'gpsUnitRegistrationService'


    ];

    function busRegistrationController($scope,$window,busRegistrationService,gpsUnitRegistrationService){

        $scope.busRegData=[];
        $scope.busdata={
            gpsUnit:'0'
        };
        $scope.gpsData = [];
        $scope.successMsg='';
        $scope.errorsMsg='';
        
        $scope.showSelectable = function (value) {

            if(value == 'bus'){
                return 'selected';
            }

        };

        $scope.getBusRegDetails=function () {
            busRegistrationService.getBusRegData().then(function(result){

                $scope.busRegData=result.data;
                $scope.totalItems = $scope.busRegData.length;
                $scope.$watch('curpage + itemspage', function() {
                    var begin = (($scope.curpage - 1) * $scope.itemspage),
                        end = begin + $scope.itemspage;
                    $scope.filteredDoc = $scope.busRegData.slice(begin, end);
                });

            });
        };

        $scope.getGpsDetails = function () {

            gpsUnitRegistrationService.getGpsUnitData().then(function (result) {

                $scope.gpsData = result.data;

            },function (error) {
                $scope.errorsMsg=err;
            });

        };
        
        $scope.edit=function(data){
            $scope.busdata=data;
            $scope.busdata.gpsUnit = data.gpsUnit.toString();
        };

        $scope.update=function(busdata){

            busRegistrationService.addBusRegData(busdata).then(function(result){

                $scope.successMsg='Successfully Data Register';
                $scope.getBusRegDetails();
                $scope.busdata={};

            },function(err){
                $scope.errorsMsg=err;
                $scope.getBusRegDetails();
            });
            
        };

        $scope.close=function(){

            $scope.busdata='';

        };


        $scope.delete=function(data){

            busRegistrationService.deleteBusRegData(data).then(function(result){

                alert('Successfully Delete !!!!!!!!');
                $scope.getBusRegDetails();

            });

        };

        $scope.getBusRegDetails();
        
        $scope.getGpsDetails();
        
    }
})();

