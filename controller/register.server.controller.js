/**
 * Created by CSS on 09-12-2016.
 */
var config=require('../config/db/registerManager');
var path = require('path');
var multer=require('multer');
var session = require('express-session');
var formidable = require('formidable');
var fs = require('fs');

// var storage=multer.diskStorage({
//
//     destination:function(req, file, callback){
//         callback(null, 'public/app/uploads/driverImage');
//     },
//     filename:function(req, file, callback){
//         console.log(file);
//         callback(null, file.fieldname + '-' + file.originalname);
//         req.session.Files=file.fieldname + '-' + file.originalname;
//     }
// });
// var uploads=multer({storage:storage}).array('file',2);
//
//
// var Filestorage=multer.diskStorage({
//
//     destination:function(req, file, callback){
//         callback(null,'public/app/uploads/driverLicencePhoto');
//     },
//     filename:function(req, file, callback){
//         console.log(file);
//         callback(null, file.fieldname + '-' + file.originalname);
//         req.session.liscence=file.fieldname + '-' + file.originalname;
//     }
// });
// var fileupload=multer({storage:Filestorage}).single('driverLiscence1');

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

        if(files.driverLicence==undefined)
        {
            data.driverLicence= fields.driverLicence;

        }else
        {
            var driverLicence=files.driverLicence;
            var rand = Math.floor(1000 + Math.random() * 9000);
            data.driverLicence = 'DriverLicense' + rand + '.' + driverLicence.type.split('/')[1];
            var is = fs.createReadStream(driverLicence.path);
            var os = fs.createWriteStream('public/uploads/driverLicense/' + data.driverLicence);
            is.pipe(os);
            is.on('end', function () {
                fs.unlinkSync(driverLicence.path, 'public/uploads/driverLicense/' + data.driverLicence);
            });


        }

        if(files.driverPhoto==undefined)
        {
            data.driverPhoto= fields.driverPhoto;

        }else {
            var driverPhoto=files.driverPhoto;
            rand = Math.floor(1000 + Math.random() * 9000);
            data.driverPhoto = 'DriverPhoto' + rand + '.' + driverPhoto.type.split('/')[1];
            var is1 = fs.createReadStream(driverPhoto.path);
            var os1 = fs.createWriteStream('public/uploads/driverPhoto/' + data.driverPhoto);
            is1.pipe(os1);
            is1.on('end', function () {
                fs.unlinkSync(driverPhoto.path, 'public/uploads/driverPhoto/' + data.driverPhoto);
            });
        }

            data.driverName = fields.driverName;
            data.mobileNo = fields.mobNo;
            data.id = fields.id;
            config.postDriverRegDatas(data).then(function (result) {
                res.send(result);
            },function (err) {
                res.send(500,{error:err});
            });



    });

};

exports.updateDriverDetails=function (req,res) {
    var data=req.body.data;

    config.updateDriverRegData(data).then(function(result){

        res.send(result);
    });
};


exports.getDriverDetails=function (req,res) {

    config.getDriverRegData().then(function(result){

        res.send(result);
    });
};

exports.deleteDriverDetails=function (req,res) {
    var data=req.body;
    config.deleteDriverRegData(data).then(function(result){

        res.send(result);
    });
};


exports.getStudentDetails=function (req,res) {
    config.getStudentRegData().then(function(result){

        res.send(result);
    });
};

exports.postStudentData=function (req,res) {
    var data=req.body;
    config.postStudentRegData(data).then(function(result){
        res.send(result);
    });
};
exports.deleteStudentData=function (req,res) {
    var data=req.body;
    config.deleteStudentRegData(data).then(function(result){
        res.send(result);
    });
};

exports.getRoutes = function (req,res) {

    config.getRoutes(function (err,result) {
        if(err){
            res.send(500,{error:err});
        }else{
            res.send(result);
        }
    });
    
};

exports.updateRoutes = function (req,res) {
  
    config.updateRoutes(req.body,function (err,result) {
        if(err){
            res.send(500,{error:err});
        }else{
            res.send(result);
        }
    });
    
};

exports.deleteRoutes = function (req,res) {

    config.deleteRoutes(req.body,function (err,result) {
        if(err){
            res.send(500,{error:err});
        }else{
            res.send(result);
        }
    });

};

exports.deleteStops = function (req,res) {

    config.deleteStops(req.body,function (err,result) {
        if(err){
            res.send(500,{error:err});
        }else{
            res.send(result);
        }
    });

};

