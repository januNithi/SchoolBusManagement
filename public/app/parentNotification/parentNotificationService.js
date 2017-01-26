/**
 * Created by CSS on 26-12-2016.
 */
(function () {

    angular.module('myApp').factory('parentNotificationService',parentNotificationService);

    parentNotificationService.$inject = [
        '$http'

    ];

    function parentNotificationService($http) {
        return{

            getParentNotification : function () {

                return $http.get('/dao/getParentNotification');

            }
        }
    }


})();