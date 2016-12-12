/**
 * Created by CSS on 09-12-2016.
 */
module.exports=function(app){
    var config=require('../controller/register.server.controller');
    
    //------------- gpsUnit---------------------------//
    
    app.post('/get/gpsUnitData',config.gpsUnitRegDetails);
    app.post('/post/gpsUnitData',config.postGpsRegDetails);
    app.post('/post/deleteGpsUnitData',config.deleteGpsRegDetails);
    app.post('/post/updateGpsUnitData',config.updateGpsRegDetails);
    
    //------------- gpsUnit---------------------------//

    //------------- busRegDetails---------------------//
    
    app.post('/get/busRegDetails',config.busRegDetails);
    app.post('/post/busRegDetails',config.addRegDetails);
    app.post('/post/deleteBusRegDetails',config.deleteRegDetails);
    
    //------------- busRegDetails---------------------//


    //------------- TripRegDetails--------------------//
    app.post('/get/tripRegDetails',config.getTripRegData);
    app.post('/get/postTableTripRegDetails',config.getTableTripRegData);
    app.post('/get/postTripRegDetails',config.postTripRegDetail);
    app.post('/get/deleteTableTripRegDetails',config.deleteTripRegDetail);
    app.post('/get/updateTableTripRegDetails',config.updateTripRegDetail);
    //------------- TripRegDetails--------------------//
    
    //------------- DriverRegDetails--------------------//
    
    app.post('/post/DriverDetail',config.postDriverDetail);
    
    //------------- DriverRegDetails--------------------//
};