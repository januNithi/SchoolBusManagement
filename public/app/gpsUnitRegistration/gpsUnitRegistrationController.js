(function(){
    angular
        .module("myApp")
        .controller("gpsUnitRegistrationController",gpsUnitRegistrationController);

    gpsUnitRegistrationController.$inject=[
        '$scope',
        '$window',
        'gpsUnitRegistrationService',
        'loginService'


    ];

    function gpsUnitRegistrationController($scope,$window,gpsUnitRegistrationService,loginService){

        $scope.getGpsData=[];
        $scope.data={};
        $scope.addbtns=false;
        $scope.curpage = 1;
        $scope.itemspage = 10;
        $scope.filteredDoc = [];
        $scope.maxSize = 4;
        $scope.totalItems = 0;
        $scope.showSelectable = function (value) {

            if(value == 'gps'){
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

        $scope.new=function(){
            $scope.data={};
        };

        $scope.getGpsUnitDetail=function(){

            gpsUnitRegistrationService.getGpsUnitData().then(function(result){

                $scope.getGpsData=result.data;
                $scope.totalItems = $scope.getGpsData.length;
                $scope.$watch('curpage + itemspage', function() {
                    var begin = (($scope.curpage - 1) * $scope.itemspage),
                        end = begin + $scope.itemspage;
                    $scope.filteredDoc = $scope.getGpsData.slice(begin, end);
                });


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

