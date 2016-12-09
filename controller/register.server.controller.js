/**
 * Created by CSS on 09-12-2016.
 */
var config=require('../config/db/registerManager');

exports.busRegDetails=function (req,res) {

    config.getBusRegDetail().then(function(result){
        res.send(result);
    },function (error) {
        res.send(500,{error:error});
    });

};

exports.addRegDetails=function (req,res) {
    var data=req.body;
    config.postBusRegDetail(data).then(function(result){
        res.send(result);
    },function (error) {
        res.send(500,{error:error});
    });

};

exports.deleteRegDetails=function (req,res) {
    var data=req.body.data;
    config.deleteBusRegDetail(data).then(function(result){
        res.send(result);
    },function (error) {
        res.send(500,{error:error});
    });

};

exports.gpsUnitRegDetails=function (req,res) {

    config.getGpsUnitRegDetail().then(function(result){
        res.send(result);
    },function (error) {
        res.send(500,{error:error});
    });

};

exports.postGpsRegDetails=function (req,res) {
    var data=req.body;
    config.postGpsUnitRegDetail(data).then(function(result){
        res.send(result);
    });

};

exports.deleteGpsRegDetails=function (req,res) {
    var data=req.body.data;
    config.deleteGpsUnitRegDetail(data).then(function(result){
        res.send(result);
    });

};


exports.updateGpsRegDetails=function (req,res) {
    var data=req.body;
    config.updateGpsUnitRegDetail(data).then(function(result){
        res.send(result);
    });

};