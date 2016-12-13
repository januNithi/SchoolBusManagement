/**
 * Created by CSS on 10-12-2016.
 */

var postion = require('../config/db/mapPositionManager');

exports.mapPosition=function (req,res) {

    postion.getBusPosition(req.query.id,req.query.date,function (error,result) {

        if(error){
            res.send(500,{error:error});
        }else{
            res.send(result);
        }

    });

};