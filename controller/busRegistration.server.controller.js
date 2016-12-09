var config=require('../config/db/busRegistration.manager');

exports.busRegDetails=function (req,res) {

    config.getBusRegDetail().then(function(result){
        res.send(result);
    });

};

exports.addRegDetails=function (req,res) {
  var data=req.body;
    config.postBusRegDetail(data).then(function(result){
        res.send(result);
    });

};
exports.deleteRegDetails=function (req,res) {
    var data=req.body.data;
    config.deleteBusRegDetail(data).then(function(result){
        res.send(result);
    });

};
