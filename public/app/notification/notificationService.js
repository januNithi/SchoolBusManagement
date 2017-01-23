/**
 * Created by CSS on 26-12-2016.
 */
(function () {

    angular.module('myApp').factory('notificationService',notificationService);

    notificationService.$inject = [
        '$http'

    ];

    function notificationService($http) {
        return{

            getAdminNotification : function () {

                return $http.get('/dao/adminNotification');

            },
            updateNotificationRead : function (id) {

                return $http.get('/dao/updateNotificationRead?id='+id);

            }
        }
    }


})();