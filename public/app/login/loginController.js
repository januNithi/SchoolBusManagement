
    
    (function(){
        angular
            .module("myApp")
            .controller("loginController",loginController);

        loginController.$inject=[
            '$scope',
            '$window',
            'loginService'


        ];

        function loginController($scope,$window,loginService){

            // $scope.user={
            //     userName:'',
            //     password:''
            // };
            // $scope.error='Invalid User Name or Password';
            // $scope.isInvalid=false;
            //
            // $scope.redirect=function()
            // {
            //
            //     if(localStorage.getItem('loggedIn')=="true")
            //     {
            //         $window.location.href = '/language';
            //     }
            //     else {
            //
            //
            //     }
            //
            // };
            // $scope.redirect();
            //
            //
            // $scope.actionLogin=function(){
            //
            //     loginService.onLogin($scope.user)
            //         .then(function(response){
            //             if(response.data==="true"){
            //                 //redirect
            //                 alert('Successfully Login!');
            //                 localStorage.setItem('loggedIn',true);
            //                 $window.location.href = '/language';
            //             }
            //             else {
            //                 //set error message
            //                 $scope.isInvalid=true;
            //                 $scope.userName='';
            //                 $scope.password='';
            //             }
            //         },function(err){
            //             // alert error
            //             alert("error");
            //
            //         });
            // };
            //
            //
            // $scope.logout=function()
            // {
            //
            //     localStorage.setItem('loggedIn',false);
            //     $window.location.href = '/logout';
            //
            //
            //
            // }
        }
    })();

