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
        $scope.showSelectable = function (value) {

            if(value == 'driver'){
                return 'selected';
            }

        };
        $scope.uploadedFile = function(element) {
            $scope.$apply(function($scope) {
                $scope.files = element.files;

                console.log($scope.files);
            });
        };
        $scope.uploadedLiscence = function(element) {
            $scope.$apply(function($scope) {

                $scope.liscence = element.files;
                console.log($scope.liscence);
            });
        };


        $scope.Save=function(data){
            $scope.driverDetails=data;

            $scope.driverDetails.file= $scope.files;
            $scope.driverDetails.driverLiscence1=$scope.liscence;

            driverRegistrationService.postDriverDetail($scope.driverDetails).then(function(result){

                $scope.driveData=result.data;

            });
        };
    }
})();

