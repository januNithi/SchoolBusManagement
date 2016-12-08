/**
 * Created by CSS on 08-12-2016.
 */


(function(){
    angular
        .module("myApp")
        .controller("homeController",homeController);

    homeController.$inject=[
        '$scope',
        '$window',
        'homeService'


    ];

    function homeController($scope,$window,homeService){

        $scope.showSelectable = function (value) {

            if(value == 'home'){
                return 'selected';
            }

        }
    }
})();

