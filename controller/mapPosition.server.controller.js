/**
 * Created by CSS on 10-12-2016.
 */

var postion = require('../config/db/mapPositionManager');

exports.mapPosition=function (req,res) {

    postion.getBusPosition(req.query,function (error,result) {

        if(error){
            res.send(500,{error:error});
        }else{
            res.send(result);
        }

    });

};

var pointsReduceAlgorithm = function (data,cb) {

    var reducedData = [];

    data.forEach(function (value,index) {

        if((index+1) != data.length){

            if((value.lat != data[index+1].lat) && (value.lng != data[index+1].lng)){
                reducedData.push(value);
            }
        }else{
            InvalidPointReduceAlgorithm(reducedData,function (result) {
                cb(result);
            });
        }
    });

};

var InvalidPointReduceAlgorithm = function (data,cb) {

    var reducedData = [];

    data.forEach(function (value,index) {

        if((index+1)!=data.length){

            var sum = value.lat + value.lng;
            var nextSum = data[index+1].lat + data[index+1].lng;

            if(Math.abs((sum - nextSum)) < 0.000800 || Math.abs((sum - nextSum)) > 0.000300){
                reducedData.push(value);
            }
        }else{
            // distanceBasedAlgorithm(reducedData);
           cb(reducedData);
        }

    });

};

exports.mapPositionByApp=function (req,res) {

    postion.getMapPositionByApp(req.query.id,req.query.fromTime,req.query.toTime,function (error,result) {

        if(error){
            res.send(500,{error:error});
        }else{
            if(result.length > 1){
                pointsReduceAlgorithm(result,function(data){
                    res.send(result);
                })
            }else{
                res.send(result);
            }
        }

    });

};