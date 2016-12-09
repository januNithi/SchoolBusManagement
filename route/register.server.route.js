/**
 * Created by CSS on 09-12-2016.
 */
module.exports=function(app){
    var config=require('../controller/register.server.controller');
    
    app.post('/get/gpsUnitData',config.gpsUnitRegDetails);
    app.post('/get/busRegDetails',config.busRegDetails);
    app.post('/post/busRegDetails',config.addRegDetails);
    app.post('/post/deleteBusRegDetails',config.deleteRegDetails)
};