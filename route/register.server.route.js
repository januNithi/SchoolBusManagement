/**
 * Created by CSS on 09-12-2016.
 */
module.exports=function(app){
    var config=require('../controller/register.server.controller');
    //------------- gpsUnit---------------------//
    app.post('/get/gpsUnitData',config.gpsUnitRegDetails);
    app.post('/post/gpsUnitData',config.postGpsRegDetails);
    app.post('/post/deleteGpsUnitData',config.deleteGpsRegDetails);
    app.post('/post/updateGpsUnitData',config.updateGpsRegDetails);
    //------------- gpsUnit---------------------//

    //------------- busRegDetails---------------------//

    app.post('/post/busRegDetails',config.addRegDetails);
    app.post('/post/deleteBusRegDetails',config.deleteRegDetails);
    app.post('/get/busRegDetails',config.busRegDetails);
    
    //------------- busRegDetails---------------------//

};