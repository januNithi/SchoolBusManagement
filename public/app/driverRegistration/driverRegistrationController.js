(function(){
    angular
        .module("myApp")
        .controller("driverRegistrationController",driverRegistrationController);

    driverRegistrationController.$inject=[
        '$scope',
        '$window',
        'driverRegistrationService',
        'loginService'


    ];

    function driverRegistrationController($scope,$window,driverRegistrationService,loginService){
        $scope.file=null;
        $scope.driveData=[];
        $scope.driverData=[];
        $scope.licence='../../images/upload.png';
        $scope.curpage = 1;
        $scope.itemspage = 10;
        $scope.filteredDoc = [];
        $scope.maxSize = 4;
        $scope.totalItems = 0;
                
        $scope.showSelectable = function (value) {

            if(value == 'driver'){
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
                $scope.totalItems = $scope.driveData.length;
                $scope.$watch('curpage + itemspage', function() {
                    var begin = (($scope.curpage - 1) * $scope.itemspage),
                        end = begin + $scope.itemspage;
                    $scope.filteredDoc = $scope.driveData.slice(begin, end);
                });


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

