/**
 * Created by CSS on 24-03-2017.
 */

(function(){
    angular
        .module("myApp")
        .controller("googleMapController",googleMapController);

    googleMapController.$inject=[
        '$scope',
        '$filter',
        'dashboardService',
        'busRegistrationService',
        'loginService',
        'configService',
        'deviceOffline',
        'deviceOnline',
        'deviceStopped',
        'unknown',
        'deviceMoving',
        'notificationService'

    ];

    function googleMapController($scope,$filter,dashboardService,busRegistrationService,
                                 loginService,configService,
                                 deviceOffline,deviceOnline,deviceStopped,unknown,deviceMoving,notificationService){

        var socket = io.connect();

        $scope.busData = [];
        $scope.currentBus = '1';
        $scope.center = '';
        $scope.zoom = 5;
        $scope.selectedDate = '---- SELECT DATE ----';
        $scope.busPosition = [];
        $scope.points = [];
        $scope.spinnerShow = false;
        $scope.deviceStatus = {
            deviceOffline : deviceOffline,
            deviceMoving : deviceMoving,
            deviceStopped : deviceStopped,
            deviceOnline : deviceOnline,
            unknown : unknown,
            undefined : unknown
        };

        $scope.choosenBuses =[];

        $scope.notify = false;
        $scope.notifyObj = {};
        $scope.readNotifyObj = [];
        $scope.unReadNotifyObj = [];

        $scope.showGoogleView = function () {
            return true;
        };

        loginService.isLoggedIn().then(function (result) {
            if(!result.data.id){
                loginService.goToLogin()
            }else{
                $scope.spinnerShow = true;
                $scope.getBusDetails();
                configService.getConfiguration().then(function (result) {
                    $scope.config = result.data;
                    // $scope.legend = {
                    //     position: 'bottomright',
                    //     colors: [ $scope.config.overSpeedColor, $scope.config.rashTurnColor, '#478bf7'],
                    //     labels: [ 'Over Speed', 'Rash Turn', 'Route Path' ]
                    // };
                    $scope.center = $scope.config.defaultCoordinates.lat +','+ $scope.config.defaultCoordinates.lng;
                    $scope.zoom = 5;

                    $scope.customIcon = {
                        "scaledSize": [48, 48],
                        "url": "images/busIcon.png"
                    };

                },function (error) {
                    console.log(error);
                });
            }

        });

        $scope.showSelectable = function (value) {

            if(value == 'googleMap'){
                return 'selected';
            }

        };

        $scope.onLogout = function () {
            loginService.onLogout().then(function () {
                loginService.goToLogin();
            });
        };

        $scope.busChosen = function (bus,id) {
            $scope.selectedRow = id;
            $scope.choosenBuses = [];
            $scope.choosenBuses.push(bus);
            $scope.selectedDate = $filter('date')(new Date(), "yyyy-MM-dd");
            $scope.searchForBusPosition();
        };

        $scope.removeBus = function (data) {
            angular.forEach($scope.choosenBuses,function (value,index) {
                if(data.id == value.id){
                    $scope.choosenBuses.splice(index,1);
                }
            });
        };

        $scope.getBusDetails = function () {
            busRegistrationService.getBusRegData().then(function (result) {
                $scope.spinnerShow = false;
                $scope.busData = result.data;
                // var bus_image = '';
                angular.forEach($scope.busData,function (value,index) {
                    if(value.lastPosition) {
                        if(Number(value.lastPosition.course) > 360){
                            value.lastPosition.course = Number(value.lastPosition.course) - 360;
                        }

                        $scope.points.push({
                            latitude : value.lastPosition.lat,
                            longitude : value.lastPosition.lng,
                            busNum :  'Bus-' + value.regNo + '-' + value.busCode,
                            time : $filter('date')(value.lastPosition.devicetime, "dd-MM-yyyy h:mm:ss a"),
                            uniqueId : value.lastPosition.deviceid,
                            degree : Number(value.lastPosition.course)
                        });
                        $scope.center =  value.lastPosition.lat+','+value.lastPosition.lng;
                        $scope.zoom = 18;

                        // var obj = {
                        //     date: value[value.length - 1].date,
                        //     gpsUnit: value[value.length - 1].deviceid
                        // };
                        //
                        // socket.emit('bus track', obj);
                    }
                });
            },function (error) {
                console.log(error);
                $scope.spinnerShow = false;
            });
        };

        $scope.getBusPositions = function (date) {

            $scope.dynMarkers = [];
            var date = $filter('date')(new Date, "yyyy-MM-dd");

            $scope.busPosition = [];
            $scope.paths = [];
            $scope.markers = [];
            var string = '';
            var bus_id = {};
            angular.forEach($scope.choosenBuses,function (value,index) {

                angular.forEach($scope.choosenBuses,function (value,index) {
                    bus_id[value.id] = value.regNo + ' - ' + value.busCode;
                });
                if((index +1) == $scope.choosenBuses.length){
                    string += 'id_'+index+'='+value.id+'&length='+$scope.choosenBuses.length+'&date='+date;
                    dashboardService.getBusPosition(string).then(function (result) {
                        if(result.data && result.data.length > 0) {

                            $scope.busPosition = result.data;
                            $scope.markers = {};
                            angular.forEach(result.data,function (value,index) {
                                if(value && value.length > 0) {
                                    if(!($scope.selectedDate == $filter('date')(value[value.length -1].date, "yyyy-MM-dd"))){
                                        angular.element("#triggerWarning").trigger('click');
                                    }
                                    if(Number(value[value.length - 1].course) > 360){
                                        value.course = Number(value[value.length - 1].course) - 360;
                                    }
                                    $scope.selectedDate = $filter('date')(value[0].date, "yyyy-MM-dd");
                                    $scope.points = [];
                                    $scope.points.push({
                                        latitude : value[value.length - 1].lat,
                                        longitude : value[value.length - 1].lng,
                                        busNum :  'Bus-' + $scope.choosenBuses[0].regNo + '-' + $scope.choosenBuses[0].busCode,
                                        time : $filter('date')(value[value.length - 1].devicetime, "dd-MM-yyyy h:mm:ss a"),
                                        uniqueId : value[value.length - 1].deviceid,
                                        degree : Number(value[value.length - 1].course)
                                    });
                                    $scope.center =  value[value.length - 1].lat+','+value[value.length - 1].lng;
                                    $scope.zoom = 18;

                                    $scope.center = value[value.length - 1].lat+',' + value[value.length - 1].lng;

                                    var obj = {
                                        date: value[value.length - 1].devicetime,
                                        gpsUnit: value[value.length - 1].deviceid
                                    };

                                    socket.emit('bus track', obj);
                                }
                            });

                        }

                    },function (error) {
                        console.log(error);
                    });
                }else{
                    string += 'id_'+index+'='+value.id+'&';
                }
            });



        };

        socket.on('notification',function (data) {

            $scope.notify = true;
            $scope.notifyObj = data;
            $scope.busData.forEach(function (value,index) {

                if($scope.notifyObj.event.deviceId == value.gpsUnit){
                    value.status = $scope.notifyObj.event.type;
                }

            });

        });

        socket.on('adminNotification',function (data) {

            $scope.notificationObject = data;
            $scope.readNotifyObj = [];
            $scope.unReadNotifyObj = [];
            angular.forEach(data,function (value,index) {
                if(value.dataRead){
                    $scope.readNotifyObj.push(value);
                }else{
                    $scope.unReadNotifyObj.push(value);
                }
            });
        });

        socket.on('Bus Stop',function (data) {
            $scope.notify = true;
            $scope.notifyStopObj = data;
        });

        socket.on('bus position',function (data) {
            var points = {
                lat: Number(data.lat),
                lng: Number(data.lng),
                riseOnHover: true,
                opacity: 5,
                riseOffset: 250
            };
            // $scope.busPosition.push(points);
            angular.forEach($scope.choosenBuses,function (value,index) {
                if(value.gpsUnit == Number(data.deviceId) && (new Date().toDateString() == new Date(Number(data.divTime)).toDateString())){

                    if(Number(data.course) > 360){
                        data.course = Number(value.lastPosition.course) - 360;
                    }
                    var tempPoint = $scope.points[0];
                    $scope.points=[];
                    $scope.points.push({
                        latitude : Number(data.lat),
                        longitude :Number(data.lng),
                        busNum :  'Bus-' + value.regNo + '-' + value.busCode ,
                        time : $filter('date')(Number(data.divTime), "dd-MM-yyyy h:mm:ss a"),
                        uniqueId : data.UniqueId,
                        degree : Number(data.course),
                    });
                    $scope.zoom = 18;

                    $scope.center= data.lat +','+data.lng;
                }
            });


        });

        $scope.searchForBusPosition = function () {
            if ($scope.busPosition.length > 0) {
                angular.forEach($scope.busPosition,function (value,index) {
                    if(value && value.length > 0){
                        var obj = {
                            date: value[value.length - 1].devicetime,
                            gpsUnit: value[value.length - 1].deviceid
                        };
                        socket.emit('stop track', obj);
                    }
                    if((index +1) == $scope.busPosition.length){
                        $scope.getBusPositions($filter('date')($scope.selectedDate, "yyyy-MM-dd"));
                    }
                });
            }else{
                $scope.getBusPositions($filter('date')($scope.selectedDate, "yyyy-MM-dd"));
            }
        };

        notificationService.getAdminNotification().then(function (result,err) {
            $scope.notificationObject = result.data;
            angular.forEach($scope.notificationObject,function (value,index) {
                if(value.dataRead){
                    $scope.readNotifyObj.push(value);
                }else{
                    $scope.unReadNotifyObj.push(value);
                }
            });
        });

        $scope.$on("$destroy", function(){
            if ($scope.busPosition.length > 0) {
                angular.forEach($scope.busPosition,function (value,index) {
                    if(value.length > 0){
                        var obj = {
                            date: value[value.length - 1].devicetime,
                            gpsUnit: value[value.length - 1].deviceid
                        };
                        socket.emit('stop track', obj);
                    }
                });
            }
        });


    }

})();

