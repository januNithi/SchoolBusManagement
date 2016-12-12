(function(){
    angular
        .module("myApp")
        .factory("tripRegistrationService",tripRegistrationService);

    tripRegistrationService.$inject=[
        '$http'
    ];

    function tripRegistrationService($http){
        return{
            getTripRegData:function () {
                return $http({

                    method: 'post',
                    url: '/get/tripRegDetails'
                });

            },
        postTripRegDetails:function(data) {

           return $http({
               method: 'post',
               url: '/get/postTripRegDetails',
               data:data
               
           });

        }, 
         getTripTableRegData:function()
            {
                return $http({
                    method: 'post',
                    url: '/get/postTableTripRegDetails'

                });
                
            },
            deleteTripRegDetails:function (data) {
                return $http({
                    method: 'post',
                    url: '/get/deleteTableTripRegDetails',
                    data:{data:data.id}
                });

            },
            updateTripRegDetails:function (data) {

                return $http({
                    method: 'post',
                    url: '/get/updateTableTripRegDetails',
                    data:data
                });
                
            }
            
        }
    }
})();