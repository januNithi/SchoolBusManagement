(function(){
    angular
        .module("myApp")
        .controller("studentRegistrationController",studentRegistrationController);

    studentRegistrationController.$inject=[
        '$scope',
        '$window',
        'studentRegistrationService',
        'tripRegistrationService',
        'loginService'


    ];

    function studentRegistrationController($scope,$window,studentRegistrationService,tripRegistrationService,loginService){

        $scope.studentRegData=[];
        $scope.tripData=[];
        $scope.stdentData={};
        $scope.curpage = 1;
        $scope.itemspage = 10;
        $scope.filteredDoc = [];
        $scope.maxSize = 4;
        $scope.totalItems = 0;
        $scope.stdentData.tripId=0;

        $scope.showSelectable = function (value) {

            if(value == 'student'){
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


        $scope.getTripRegDetails = function () {

            tripRegistrationService.getTripRegData().then(function (result) {

                $scope.tripData = result.data;
                console.log($scope.tripData);

            });

        };
        $scope.getTripRegDetails();
        
        $scope.getStudentRegData=function()
        {
            studentRegistrationService.getStudentData().then(function (result) {
                $scope.studentRegData=result.data;
                $scope.totalItems = $scope.studentRegData.length;
                $scope.$watch('curpage + itemspage', function() {
                    var begin = (($scope.curpage - 1) * $scope.itemspage),
                        end = begin + $scope.itemspage;
                    $scope.filteredDoc = $scope.studentRegData.slice(begin, end);
                });
                    
            });

        };
        $scope.getStudentRegData();

        $scope.Edit=function(data){

            $scope.stdentData=data;
            console.log($scope.stdentData);
        };
        $scope.close=function()
        {
            $scope.stdentData='';

        };

        $scope.new=function()
        {
            $scope.stdentData={};
            $scope.stdentData.tripId=0;

        };
        
        $scope.save=function(data)
        {

           var studentRegData={

                Name:data.Name,
                Gender:data.Gender,
                MobileNo:data.MobileNo,
                tripId:data.tripId,
                id:data.id
            };
            studentRegistrationService.postStudentData(studentRegData).then(function (result) {

               alert('Successfully Registerd !!!!!!!'); 
               $scope.stdentData='';
               $scope.getStudentRegData();
            });
            
        };
        $scope.delete=function(data)
        {
            studentRegistrationService.deleteStudentData(data).then(function (result) {

                alert('Successfully Delete !!!!!!!');
                $scope.stdentData='';
                $scope.getStudentRegData();
            });
        }

    }
})();

