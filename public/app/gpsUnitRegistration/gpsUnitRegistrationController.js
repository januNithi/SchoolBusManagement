(function(){
    angular
        .module("myApp")
        .controller("gpsUnitRegistrationController",gpsUnitRegistrationController);

    gpsUnitRegistrationController.$inject=[
        '$scope',
        '$window',
        'gpsUnitRegistrationservice'


    ];

    function gpsUnitRegistrationController($scope,$window,gpsUnitRegistrationservice){

        $scope.getGpsData=[];
        $scope.showSelectable = function (value) {

            if(value == 'gps'){
                return 'selected';
            }

        };

        $scope.getGpsUnitDetail=function(){

            gpsUnitRegistrationservice.getGpsUnitData().then(function(result){


                $scope.getGpsData=result.data;

            });


        };
        $scope.getGpsUnitDetail();

    }
})();

