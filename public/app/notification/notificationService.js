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
            getEvent : function () {
                return $http.get('/report/eventReport?id=null&from=null&to=null');
            }
        }
    }


})();