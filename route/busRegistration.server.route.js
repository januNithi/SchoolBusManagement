module.exports=function(app){
    var config=require('../controller/busRegistration.server.controller');
    app.post('/get/busRegDetails',config.busRegDetails);
    app.post('/post/busRegDetails',config.addRegDetails);
    app.post('/post/deleteBusRegDetails',config.deleteRegDetails)


};