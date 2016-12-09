(function(){
    angular
        .module("myApp")
        .controller("gpsUnitRegistrationController",gpsUnitRegistrationController);

    gpsUnitRegistrationController.$inject=[
        '$scope',
        '$window',
        'gpsUnitRegistrationService'


    ];

    function gpsUnitRegistrationController($scope,$window,gpsUnitRegistrationService){

        $scope.getGpsData=[];
        $scope.data={};
        $scope.addbtns=false;
        $scope.showSelectable = function (value) {

            if(value == 'gps'){
                return 'selected';
            }

        };

        $scope.getGpsUnitDetail=function(){

            gpsUnitRegistrationService.getGpsUnitData().then(function(result){

                $scope.getGpsData=result.data;

            });


        };
        $scope.Update=function(data)
        {
            gpsUnitRegistrationService.updateGpsUnitData(data).then(function(result){
                alert('Update register');
                $scope.data='';
                $scope.getGpsUnitDetail();

            });



        };

        $scope.getGpsUnitDetail();
        
        $scope.add=function(data){
            $scope.addbtns=true;
            gpsUnitRegistrationService.postGpsUnitData(data).then(function(result){

                alert('successfully register');
                $scope.data='';
                $scope.getGpsUnitDetail();


            });
            
        };

        $scope.close=function(){

            $scope.data='';

        };
        
        $scope.edit=function(Data){
            
            $scope.data=Data;
        };
        $scope.delete=function(data){

            gpsUnitRegistrationService.deleteGpsUnitData(data).then(function(result){

                alert('delete register');
                $scope.getGpsUnitDetail();


            });

        }
    }
})();

