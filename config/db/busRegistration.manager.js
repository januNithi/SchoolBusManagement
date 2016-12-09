var mysql = require('mysql');
var q=require('q');
var db = require('../sqlDb');
var con = mysql.createConnection(db);
var fs = require('fs');




function getBusRegDetail() {
    
    var deferred = q.defer();
    var RegInfo = "select id,regNo,busCode,gpsUnit from bus";
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
function postBusRegDetail(data) {

    var deferred = q.defer();
    var RegInfo = "insert into bus(regNo,busCode,gpsUnit)values('"+data.regNo+"','"+data.busName+"','"+data.gpsUnit+"')";
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
function deleteBusRegDetail(data) {

    var deferred = q.defer();
    var RegInfo = "Delete from bus where id='"+data+"'";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

}

module.exports= {

    getBusRegDetail: getBusRegDetail,
    postBusRegDetail:postBusRegDetail,
    deleteBusRegDetail:deleteBusRegDetail

};


