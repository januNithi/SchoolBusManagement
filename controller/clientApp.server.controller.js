/**
 * Created by CSS on 29-12-2016.
 */

var manager = require("../config/db/clientAppManager");

exports.updateNotificationStop = function (req,res) {
  
    manager.updateNotificationStop(req.query.stopId,req.query.studId,function (err,result) {
       if(err){
           res.send(500,{error:err});
       }else{
           res.send(result);
       }
    });
    
};

exports.updateNotificationStopdup = function (req,res) {

    manager.updateNotificationStopdup(req.query.stops,req.query.studId,function (err,result) {
        if(err){
            res.send(500,{error:err});
        }else{
            res.send(result);
        }
    });

};



exports.getAppStartData = function (req,res) {

    manager.getAppStartData(req.query,function (err,result) {
        if(err){
            res.send(500,{error:err});
        }else{
            res.send(result);
        }
    });

};

exports.sendNotification = function (stopReachData,cb) {
  
    manager.getUser(stopReachData.id,function (err,result) {
        if(err){
            cb(err,result);
        }else{
            if(result.length > 0) {
                var data = result;
                data.forEach(function (value,index) {
                    manager.getStopDetails(value.stopId,function (err,result) {
                        if(err){
                            cb(err,result);
                        }else{
                            value.stop = result[0];
                            if(data.length == (index +1)){
                                cb(err,data);
                            }
                        }
                    });
                });

            }else{
                cb(err,result);
            }
        }
    });
    
};

exports.checkTripTime = function (cb) {
    manager.getNotificationTrip(function (err,result) {
        cb(err,result);      
    });
};

exports.getUserId = function (deviceId,cb) {
    manager.getGeofenceUserDetails(deviceId,function (err,result) {
       cb(err,result);
    });
};

exports.getGeofenceByUserid = function (geofenceid,userid,cb) {

    manager.getGeofenceByUserid(geofenceid,userid,function (err,result) {
       cb(err,result);
    });

};

exports.updateNotification = function (data,cb) {

    manager.updateNotification(data,function (err,result) {
       cb(err,result);
    });

};
exports.getAdminNotification = function (cb) {

    manager.getAdminNotification(function (err,result) {
        cb(err,result);
    });

};
exports.getAdminNotifications = function (req,res) {

    manager.getAdminNotification(function (err,result) {
        if(err){
            res.send(500,{error:err});
        }else{
            res.send(result);
        }
    });

};

exports.updateNotificationRead = function (req,res) {

    manager.updateReadNotification(req.query.id,function (err,result) {
        if(err){
            res.send(500,{error:err});
        }else{
            res.send(result);
        }
    });

};

exports.updateParentNotification = function (data,cb) {

    manager.updateParentNotification(data,function (err,result) {
        cb(err,result);
    });

};

exports.getParentNotification = function (req,res) {

    manager.getParentNotification(function (err,result) {
        if(err){
            res.send(500,{error:err});
        }else{
            res.send(result);
        }
    });

};