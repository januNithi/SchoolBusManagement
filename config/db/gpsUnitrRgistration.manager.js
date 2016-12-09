var mysql = require('mysql');
var q=require('q');
var db = require('../sqlDb');
var con = mysql.createConnection(db);
var fs = require('fs');

function getGpsUnitRegDetail() {

    var deferred = q.defer();
    var RegInfo = "select id,unitName from gpsunit";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};

module.exports= {

    getGpsUnitRegDetail: getGpsUnitRegDetail
   
};
