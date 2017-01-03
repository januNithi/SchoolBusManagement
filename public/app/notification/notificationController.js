/**
 * Created by CSS on 26-12-2016.
 */
(function () {

    angular.module('myApp').controller('notificationController',notificationController);

    notificationController.$inject = [
        '$scope',
        'notificationService'
    ];

    function notificationController($scope,notificationService) {

        $scope.events = [];
        $scope.onlineEvents = [];
        $scope.offlineEvents = [];
        $scope.geofenceEvents =[];

        $scope.showSelectable = function (value) {

            if(value == 'notification'){
                return 'selected';
            }

        };

        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.showDate = function (dateString) {

            return new Date(dateString).toLocaleString();

        };

        notificationService.getEvent().then(function (result,err) {

            if(err){
                console.log(err);
            }else{
                $scope.events = result.data;
                filterEvents();
            }


        });

        var filterEvents = function () {

            angular.forEach($scope.events,function (value,index) {
                if(value.event.type == 'deviceOnline') {
                    $scope.onlineEvents.push(value);
                }
                if(value.event.type == 'deviceOffline' || value.event.type == 'deviceStopped') {
                    $scope.offlineEvents.push(value);
                }
                if(value.event.type == 'geofenceEnter' || value.event.type == 'geofenceExit') {
                    $scope.geofenceEvents.push(value);
                }
            });


        }
        
    }

})();