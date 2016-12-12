/**
 * Created by CSS on 09-12-2016.
 */
var config=require('../config/db/registerManager');
var path = require('path');
var multer=require('multer');
var session = require('express-session');

var storage=multer.diskStorage({

    destination:function(req, file, callback){
        callback(null, 'public/app/upload/driverImage');
    },
    filename:function(req, file, callback){
        console.log(file);
        callback(null, file.fieldname + '-' + file.originalname);
        req.session.Files=file.fieldname + '-' + file.originalname;
    }
});
var upload=multer({storage:storage}).single('file');


var Filestorage=multer.diskStorage({

    destination:function(req, file, callback){
        callback(null,'public/app/upload/driverLicencePhoto');
    },
    filename:function(req, file, callback){
        console.log(file);
        callback(null, file.fieldname + '-' + file.originalname);
        req.session.liscence=file.fieldname + '-' + file.originalname;
    }
});
var fileupload=multer({storage:Filestorage}).single('driverLiscence1');

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

exports.getTripRegData=function (req,res) {
    config.getTripRegDatas().then(function(result){
        res.send(result);
    });

};
exports.getTableTripRegData=function (req,res) {
    var data=req.body;
    config.getTableTripRegDatas(data).then(function(result){
        res.send(result);
    });

};
exports.postTripRegDetail=function (req,res) {
    var data=req.body;
    config.postTripRegDatas(data).then(function(result){
        res.send(result);
    });

};
exports.deleteTripRegDetail=function (req,res) {
    var data=req.body.data;
    config.deleteTripRegDatas(data).then(function(result){
        res.send(result);
    });

};
exports.updateTripRegDetail=function (req,res) {
    var data=req.body;
    config.updateTripRegDatas(data).then(function(result){
        res.send(result);
    });

};
exports.postDriverDetail=function (req,res) {
    upload(req,res,function(err) {
        if(err) {
            console.log("err1"+err);
            return res.end("Error uploading file.");
        }
        fileupload(req,res,function(err) {
            if(err) {
                console.log("error2"+err);
                
                return res.end("Error uploading file.");
            }
            var data=req.body;
            data.photo= req.session.Files;
            data.licencePhoto=req.session.liscence;
            console.log(data);

            config.postDriverRegDatas(data).then(function (result) {
                res.send(result);
            });
        });


    });
    //
    // upload(req,res,function(err) {
    //     if (err) {
    //         return res.end("Error uploading file.");
    //     }
    //
    //     });
    //

        // var data=req.body;


};