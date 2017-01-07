(function(){
    angular
        .module("myApp")
        .factory("studentRegistrationService",studentRegistrationService);

    studentRegistrationService.$inject=[
        '$http'
    ];

    function studentRegistrationService($http){
        return{

            getStudentData:function()
            {
                return $http({
                    
                    method:'post',
                    url:'/get/studentData'
                    
                })
                
            },
            postStudentData:function(data)
            {
            
            return $http({


                method:'post',
                url:'/post/studentData',
                data:data
            })
           },
            deleteStudentData:function(data)
            {

                return $http({


                    method:'post',
                    url:'/delete/studentData',
                    data:{data:data.id}
                })
                
                
            },
            getRoutes : function (id) {
                return $http.get('/dao/getRoutes?route='+id);
            }
            

        }
    }
})();