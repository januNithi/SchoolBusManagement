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
        $scope.stops = [];
        $scope.curpage = 1;
        $scope.itemspage = 5;
        $scope.filteredDoc = [];
        $scope.maxSize = 4;
        $scope.totalItems = 0;
        $scope.stdentData = {
            tripId:0,
            stopId:0
        };
        $scope.trip = {
            trip_id : 0,
            stop_id : 0
        };

        $scope.showSelectable = function (value) {

            if(value == 'student'){
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

                angular.forEach($scope.studentRegData,function (value,index) {
                    value.trip = [];
                    if(value.tripId){
                        var trip = value.tripId.split(',');
                        var tripName = value.trpName.split(',');
                        var stop = value.stopId.split(',');
                        var stopName = value.stpName.split(',');
                        var trips = value.tripsId.split(',');
                        angular.forEach(trip,function (value1,index1) {

                            value.trip.push({
                                trip_id : Number(value1),
                                stop_id : Number(stop[index1]),
                                tripName : tripName[index1],
                                stopName : stopName[index1],
                                id : Number(trips[index1])
                            });
                        })
                    }


                });

                $scope.totalItems = $scope.studentRegData.length;
                $scope.$watch('curpage + it1emspage', function() {
                    var begin = (($scope.curpage - 1) * $scope.itemspage),
                        end = begin + $scope.itemspage;
                    $scope.filteredDoc = $scope.studentRegData.slice(begin, end);
                });
                    
            });

        };

        $scope.addTrip = function (student) {

            $scope.trip.stud_id = student.id;

        };
        
        $scope.updateTrip = function () {
            studentRegistrationService.updateStudentTrip($scope.trip).then(function (result) {
                alert("Successfully Updated");
                $scope.trip = {
                    trip_id : 0,
                    stop_id : 0
                };
                $scope.getStudentRegData();
            },function (error) {
               console.log(error);
            });
        };
        
        $scope.getStudentRegData();

        $scope.editTrip = function (student,trip) {

            $scope.getStops(trip.trip_id);
            $scope.trip = {
                trip_id : trip.trip_id,
                stop_id : trip.stop_id,
                stud_id : student.id,
                id : trip.id
            };


        };

        $scope.Edit=function(data){

            $scope.stdentData=data;
            $scope.getStops();
            if(!$scope.stdentData.stopId){
                $scope.stdentData.stopId = 0;
            }

            console.log($scope.stdentData);
        };
        $scope.close=function()
        {
            $scope.stdentData={
                tripId:0,
                stopId:0
            };

            $scope.trip = {
                trip_id : 0,
                stop_id : 0
            };

        };

        $scope.new=function()
        {
            $scope.stdentData = {
                tripId:0,
                stopId:0
            };

        };
        
        $scope.save=function(data,trip)
        {

           var studentRegData={

                Name:data.Name,
                Gender:data.Gender,
                MobileNo:data.MobileNo,
                tripId:data.tripId,
                id:data.id,
                stopId : data.stopId
            };
            studentRegistrationService.postStudentData(studentRegData).then(function (result) {

               alert('Successfully Registerd !!!!!!!');
                $scope.stdentData = {
                    tripId:0,
                    stopId:0
                };
               $scope.getStudentRegData();
            });
            
        };
        $scope.delete=function(data)
        {
            studentRegistrationService.deleteStudentData(data).then(function (result) {

                alert('Successfully Delete !!!!!!!');
                $scope.stdentData = {
                    tripId:0,
                    stopId:0
                };
                $scope.getStudentRegData();
            });
        }


        $scope.getStops = function (tripId) {

            var cont = true;

            angular.forEach($scope.tripData,function (value,index) {

                if(cont){

                    if(value.id == tripId){

                        cont = false;

                        studentRegistrationService.getRoutes(value.rtId).then(function (result,err) {

                            if(err){
                                console.log(err);
                            }else{

                                $scope.stops = result.data[0].stops;
                            }



                        });

                    }

                }

            });

        }

    }
})();

