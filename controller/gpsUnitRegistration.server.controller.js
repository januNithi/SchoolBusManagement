var config=require('../config/db/gpsUnitrRgistration.manager');

exports.gpsUnitRegDetails=function (req,res) {

    config.getGpsUnitRegDetail().then(function(result){
        res.send(result);
    });

};
