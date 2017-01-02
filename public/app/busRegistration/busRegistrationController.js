

(function(){
    angular
        .module("myApp")
        .controller("busRegistrationController",busRegistrationController);

    busRegistrationController.$inject=[
        '$scope',
        '$window',
        'busRegistrationService',
        'gpsUnitRegistrationService',
        'geofenceRegistrationService',
        'loginService'


    ];

    function busRegistrationController($scope,$window,busRegistrationService,gpsUnitRegistrationService,geofenceRegistrationService,loginService){
    
        $scope.busRegData=[];
        $scope.busdata={
            gpsUnit:'0'
        };
        $scope.gpsData = [];
        $scope.successMsg='';
        $scope.errorsMsg='';
        $scope.curpage = 1;
        $scope.itemspage = 10;
        $scope.filteredDoc = [];
        $scope.maxSize = 4;
        $scope.totalItems = 0;

        $scope.geofences=[];
        $scope.selGeofences=[];
        $scope.selGeofenceArry=[];

        $scope.showSelectable = function (value) {

            if(value == 'bus'){
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


        $scope.new=function(){
            $scope.busdata={
                gpsUnit:'0'
            };
        };
        $scope.getBusRegDetails=function () {
            busRegistrationService.getBusRegData().then(function(result){

                $scope.busRegData=result.data;
                $scope.totalItems = $scope.busRegData.length;
                $scope.$watch('curpage + itemspage', function() {
                    var begin = (($scope.curpage - 1) * $scope.itemspage),
                        end = begin + $scope.itemspage;
                    $scope.filteredDoc = $scope.busRegData.slice(begin, end);
                });

            });
        };

        $scope.getGpsDetails = function () {

            gpsUnitRegistrationService.getGpsUnitData().then(function (result) {

                $scope.gpsData = result.data;

            },function (error) {
                $scope.errorsMsg=err;
            });

        };
        
        $scope.edit=function(data){
            $scope.busdata=data;
            $scope.busdata.gpsUnit = data.gpsUnit.toString();
        };

        $scope.update=function(busdata){

            busRegistrationService.addBusRegData(busdata).then(function(result){

                $scope.successMsg='Successfully Data Register';
                $scope.getBusRegDetails();
                $scope.busdata={};

            },function(err){
                $scope.errorsMsg=err;
                $scope.getBusRegDetails();
            });
            
        };

        $scope.close=function(){

            $scope.busdata='';

        };


        $scope.delete=function(data){

            busRegistrationService.deleteBusRegData(data).then(function(result){

                alert('Successfully Delete !!!!!!!!');
                $scope.getBusRegDetails();

            });

        };


        var getGeofences=function(){
            geofenceRegistrationService.getGeofences().then(function(result){
                console.log(result.data);
                $scope.geofences=result.data;
                for(i=0;i<result.data.length;i++){
                    $scope.selGeofences.push(false);
                }

                console.log($scope.selGeofences);
            },function(err){
                console.log('error');
            });

        };


        $scope.addGeofence=function(data,id){

            $scope.selGeofenceArry=[];

            // $scope.selGeofenceArry.push(data.id);

            for(i=0;i<$scope.selGeofences.length;i++){

                if($scope.selGeofences[i]==true)
                    $scope.selGeofenceArry.push($scope.geofences[i].id);
            }
            // $.each(names, function(i, el){
            // if($scope.selGeofences[id]=true){
            //     if($.inArray(data.id, $scope.selGeofenceArry) === -1) $scope.selGeofenceArry.push(data.id);
            // }
            // else
            //     $scope.selGeofenceArry.remove(data.id);


            // });
            console.log($scope.selGeofenceArry);
            
        };

        $scope.openGeofence=function(data){
            $scope.busData=data;

            getMapGeofenceById($scope.busData.gpsUnit);
        };

        getMapGeofenceById=function(id){

            $scope.selGeofences=[];
            $scope.selGeofenceArry=[];

            geofenceRegistrationService.getMapGeofenceDataById(id).then(function(result){

                console.log(result.data);
                for(i=0;i<$scope.geofences.length;i++){
                    for(j=0;j<result.data.length;j++){

                        if($scope.geofences[i].id==result.data[j].geofenceid){
                            $scope.selGeofences[i]=true;
                            $scope.selGeofenceArry.push(result.data[j].geofenceid);
                        }

                    }

                }
                console.log($scope.selGeofences);

            },function(err){
                console.log('error');
            });
        };
        $scope.mapGeofenceToDevice=function(data){


            var mapData={
                gpsUnit:$scope.busData.gpsUnit,
                geofenceId:$scope.selGeofenceArry
            };


            geofenceRegistrationService.mapGeofenceToDevice(mapData).then(function(result){
                console.log(result.data);
                // $scope.geofences=result.data;

                for(i=0;i<$scope.geofences.length;i++){
                    $scope.selGeofences[i]=false;

                }

                $scope.selGeofenceArry=[];

            },function(err){
                console.log('error');
            });

        };

        Array.prototype.remove = function() {
            var what, a = arguments, L = a.length, ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };


        $scope.getBusRegDetails();
        
        $scope.getGpsDetails();
        getGeofences();
        
    }
})();

