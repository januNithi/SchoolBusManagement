/**
 * Created by CSS on 09-12-2016.
 */
var config=require('../config/db/registerManager');
var path = require('path');
var multer=require('multer');
var session = require('express-session');
var formidable = require('formidable');
var fs = require('fs');

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
var upload=multer({storage:storage}).array('file',2);


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

    var form = new formidable.IncomingForm();

    var data = {};

    form.parse(req,function (err,fields,files) {

        var driverLicense = files.file1;
        var driverPhoto = files.file;

        var rand = Math.floor(1000 + Math.random() * 9000);
        data.driverLicense = 'DriverLicense'+rand+'.'+driverLicense.type.split('/')[1];

        var is = fs.createReadStream(driverLicense.path);
        var os = fs.createWriteStream('public/uploads/driverLicense/'+data.driverLicense);
        is.pipe(os);
        is.on('end', function () {
            fs.unlinkSync(driverLicense.path, 'public/uploads/driverLicense/'+data.driverLicense);
        });

        rand = Math.floor(1000 + Math.random() * 9000);
        data.driverPhoto = 'DriverPhoto'+rand+'.'+driverPhoto.type.split('/')[1];

        var is1 = fs.createReadStream(driverPhoto.path);
        var os1 = fs.createWriteStream('public/uploads/driverPhoto/'+data.driverLicense);
        is1.pipe(os1);
        is1.on('end', function () {
            fs.unlinkSync(driverPhoto.path, 'public/uploads/driverPhoto/'+data.driverLicense);
        });
        data.driverName = fields.driverName;
        data.mobileNo = fields.mobNo;

        config.postDriverRegDatas(data).then(function (result) {
            res.send(result);
        },function (err) {
            res.send(500,{error:err});
        });

    });

    //
    //
    // upload(req,res,function(err) {
    //     if(err) {
    //         console.log("err1"+err);
    //         return res.end("Error uploading file.");
    //     }
    //     fileupload(req,res,function(err) {
    //         if(err) {
    //             console.log("error2"+err);
    //
    //             return res.end("Error uploading file.");
    //         }
    //         var data=req.body;
    //         data.photo= req.session.Files;
    //         data.licencePhoto=req.session.liscence;
    //         console.log(data);
    //
    //         config.postDriverRegDatas(data).then(function (result) {
    //             res.send(result);
    //         });
    //     });


    // });
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