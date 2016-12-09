

(function(){
    angular
        .module("myApp")
        .controller("busRegistrationController",busRegistrationController);

    busRegistrationController.$inject=[
        '$scope',
        '$window',
        'busRegistrationService'


    ];

    function busRegistrationController($scope,$window,busRegistrationService){

        $scope.busRegData=[];
        $scope.busdata={};
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

            });
        };
        $scope.getBusRegDetails();
        
        $scope.edit=function(data){
            $scope.edittitle=true;
            $scope.newtitle=false;
            $scope.busdata=data;
            console.log(data);
            
        };

        $scope.update=function(busdata){

            busRegistrationService.addBusRegData(busdata).then(function(result){

                $scope.successMsg='Successfully Data Register';
                $scope.getBusRegDetails();
                $scope.busdata='';

            },function(err){

                $scope.errorsMsg=err;
                $scope.getBusRegDetails();
            });
            
            
            
        };

        $scope.cancel=function(){

            $scope.busdata='';

        };
        $scope.close=function(){

            $scope.busdata='';

        };


        $scope.delete=function(data){

            busRegistrationService.deleteBusRegData(data).then(function(result){

                alert('Successfully Delete !!!!!!!!');
                $scope.getBusRegDetails();

            });

        }
    }
})();

