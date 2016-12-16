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
    app.post('/get/postTripRegDetails',config.postTripRegDetail);
    app.post('/get/deleteTableTripRegDetails',config.deleteTripRegDetail);
    app.post('/get/updateTableTripRegDetails',config.updateTripRegDetail);
    //------------- TripRegDetails--------------------//
    
    //------------- DriverRegDetails--------------------//
    
    app.post('/post/DriverDetail',config.postDriverDetail);
    app.post('/get/DriverDetail',config.getDriverDetails);
    app.post('/delete/DriverDetail',config.deleteDriverDetails);
    app.post('/post/updateDriverDetail',config.updateDriverDetails);
    
    
    
    //------------- DriverRegDetails--------------------//

    //------------- StudentRegDetails--------------------//

    app.post('/get/studentData',config.getStudentDetails);
    app.post('/post/studentData',config.postStudentData);
    app.post('/delete/studentData',config.deleteStudentData);

    //------------- StudentRegDetails--------------------//
    
};