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

exports.mapPositionByApp=function (req,res) {

    postion.getMapPositionByApp(req.query.date,req.query.id,function (error,result) {

        if(error){
            res.send(500,{error:error});
        }else{
            res.send(result);
        }

    });

};