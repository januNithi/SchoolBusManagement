(function(){
    angular
        .module("myApp")
        .controller("driverRegistrationController",driverRegistrationController);

    driverRegistrationController.$inject=[
        '$scope',
        '$window',
        'driverRegistrationService'


    ];

    function driverRegistrationController($scope,$window,driverRegistrationService){
        $scope.file=null;
        $scope.driveData=[];
        $scope.driverData=[];
        $scope.licence='../../images/upload.png';
                
        $scope.showSelectable = function (value) {

            if(value == 'driver'){
                return 'selected';
            }

        };
        $scope.uploadedFile = function(element) {
            $scope.$apply(function($scope) {
                $scope.driverData.drvLicence = element.files;

            });
        };
        $scope.uploadedLiscence = function(element) {
            $scope.$apply(function($scope) {

                $scope.driverData.drvPhoto = element.files;

            });
        };


        $scope.getDirverData=function () {

            driverRegistrationService.getDriverDetails().then(function(result){

                $scope.driveData=result.data;

            });
            
        };
        $scope.getDirverData();

        $scope.Save=function(data){
                $scope.driverDetails = data;
                // $scope.driverDetails.file = $scope.files;
                // $scope.driverDetails.driverLiscence = $scope.liscence;
                driverRegistrationService.postDriverDetail($scope.driverDetails).then(function (result) {

                    alert('Successfully Registered !!!!!!');
                    $scope.getDirverData();
                    $scope.data = '';
                    $scope.files = '';
                    $scope.liscence = '';
                    $scope.driverData='';


                });

        };

        $scope.showFileDialog=function(){


            document.getElementById("file").click();
        };
        
        $scope.chooseDriverLicence=function(){


            document.getElementById("file1").click();
        };
        
        $scope.delete=function(data)
        {

            driverRegistrationService.deleteDriverDetail(data).then(function(result){

                alert('Successfully Delete !!!!!!');
                $scope.getDirverData();
              
            });
            
        };

        $scope.Edit=function(data)
        {

            $scope.driverData=data;
        };

        $scope.close=function(){

            $scope.driverData='';
        };
        
        $scope.update=function(data)
        {


            driverRegistrationService.updateDriverDetail(data).then(function(result) {

                alert('Successfully Update !!!!!!');
                $scope.getDirverData();

            });
        }
    }
})();

