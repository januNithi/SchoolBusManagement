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

exports.sendNotification = function (stopReachData,cb) {
  
    manager.getUser(stopReachData.id,function (err,result) {
        if(err){
            cb(err,result);
        }else{
            if(result.length > 0) {
                var data = result[0];
                manager.getStopDetails(result[0].stopId,function (err,result) {
                    if(err){
                        cb(err,result);
                    }else{
                        data.stop = result[0];
                        cb(err,data);
                    }
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