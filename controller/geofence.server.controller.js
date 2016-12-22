/**
 * Created by CSS on 10-12-2016.
 */

var geofence = require('../config/db/geofenceManager');

exports.geofenceRegister=function (req,res) {

    geofence.geofenceRegister(req.body,function (error,result) {

        if(error){
            res.send(500,{error:error});
        }else{
            res.send(result);
        }

    });

};

exports.getGeofences=function (req,res) {

    geofence.getGeofences(function (error,result) {
        console.log(result);
        if(error){
            console.log(error);
            res.send(500,{error:error});
        }else{
            res.send(result);
        }

    });

};

exports.getGeofenceById=function (req,res) {

    var id=req.param.id;
    geofence.getGeofenceById(id,function (error,result) {

        if(error){
            res.send(500,{error:error});
        }else{
            res.send(result);
        }

    });

};

exports.deletGeofence=function (req,res) {
console.log(req.params);
    var id=req.params.id;
    geofence.deleteGeofence(id,function (error,result) {

        if(error){
            res.send(500,{error:error});
        }else{
            res.send(result);
        }

    });

};

exports.updateGeofence=function (req,res) {

    console.log("hai");
    var id=req.params.id;
    var data=req.body;

    delete data.id;
    geofence.updateGeofence(id,data,function (error,result) {

        if(error){
            res.send(500,{error:error});
        }else{
            res.send(result);
        }

    });

};


exports.mapGeofenceData=function (req,res) {

    var data= {
        gpsId: req.body.gpsUnit,
        geofenceId: req.body.geofenceId
    };

    console.log(data.geofenceId);
    geofence.deleteMapping(data.gpsId,function (error,result) {

        if(error)
            res.send(500,{error:error});
        else {
            if(data.geofenceId.length > 0){
                geofence.mapGeofence(data,function (error,result) {

                    if(error){
                        res.send(500,{error:error});
                    }else{
                        res.send(result);
                    }

                });
            }


        }
    });

};

exports.getMapGeofenceById=function (req,res) {

    var id=req.params.id;
    geofence.getGeofenceMapping(id,function (error,result) {

        if(error)
            res.send(500,{error:error});
        else {
            res.send(result);
        }
    });

};


exports.notify=function (req,res) {

    console.log(req.body);

};


