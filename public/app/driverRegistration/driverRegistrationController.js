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
        $scope.driverData={};
        $scope.licence='../../images/upload.png';
        $scope.drvPhoto='../../images/upload.png';
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

            // $scope.drvPhoto=element.files[0];

            // loadImage(element);

        };
        $scope.uploadedLiscence = function(element) {
            $scope.$apply(function($scope) {

                $scope.driverData.drvPhoto = element.files;


            });


        };

        $scope.new=function(){


            $scope.driverData={};
            $scope.licence='../../images/upload.png';
            $scope.drvPhoto='../../images/upload.png';

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
            $scope.licence='../../uploads/driverLicense/'+$scope.driverData.drvLicence;
            $scope.drvPhoto='../../uploads/driverPhoto/'+$scope.driverData.drvPhoto;
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
        };

        loadImage=function(elem){

            var src =elem;// document.getElementById(elem.id);
            var target;
            if(src==document.getElementById("file"))
                target= document.getElementById("image1");
            else
                target= document.getElementById("image2");
            // showImage(src,target);
        };





        function showImage(src,target) {
            var fr=new FileReader();
            // when image is loaded, set the src of the image where you want to display it

            fr.onload = function(e) { target.src = this.result;};
            fr.readAsDataURL(src.files[0]);

            // src.addEventListener("change",function() {
            //     // fill fr with image data
            //     alert('inside');
            //     fr.readAsDataURL(src.files[0]);
            // });
        }
    }
})();

