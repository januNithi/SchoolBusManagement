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
        $scope.curpage = 1;
        $scope.itemspage = 15;
        $scope.filteredDoc = [];
        $scope.maxSize = 4;
        $scope.totalItems = 0;

        $scope.selectedNotify;
        $scope.selectedunReadNotify;

        $scope.readNotifyObj = [];
        $scope.unReadNotifyObj = [];

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


        var getAdminNotification = function () {

            notificationService.getAdminNotification().then(function (result,err) {
                if(err){
                    alert(err);
                }else {
                    $scope.notificationObject = result.data;

                    $scope.totalItems = $scope.notificationObject.length;
                    $scope.$watch('curpage + itemspage', function() {
                        var begin = (($scope.curpage - 1) * $scope.itemspage),
                            end = begin + $scope.itemspage;
                        $scope.notificationData = $scope.notificationObject.slice(begin, end);
                    });
                    
                    $scope.readNotifyObj = [];
                    $scope.unReadNotifyObj = [];
                    angular.forEach($scope.notificationObject, function (value, index) {

                        if (value.dataRead) {
                            $scope.readNotifyObj.push(value);
                        } else {
                            $scope.unReadNotifyObj.push(value);
                        }

                    });
                }
            });

        };



        $scope.expandNotification = function (data) {
            $scope.selectedNotifyData = data;
            angular.element('#notificationExpander').trigger('click');
            if(!data.dataRead) {
                notificationService.updateNotificationRead(data.id).then(function (result, err) {
                    if (err) {
                        alert(err);
                    } else {
                        getAdminNotification();
                    }
                });
            }

        };

        $scope.notificationSelected = function (data,index) {

            $scope.selectedNotify = index;
            $scope.selectedunReadNotify = null;

        };

        $scope.notificationunReadSelected = function (data,index) {
            $scope.selectedunReadNotify = index;
            $scope.selectedNotify = null;
        };

        getAdminNotification();
        
    }

})();