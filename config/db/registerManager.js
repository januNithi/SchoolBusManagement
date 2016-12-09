/**
 * Created by CSS on 09-12-2016.
 */
var mysql = require('mysql');
var q=require('q');
var db = require('../db');
var con = mysql.createConnection(db);

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

    getBusRegDetail: getBusRegDetail,
    postBusRegDetail:postBusRegDetail,
    deleteBusRegDetail:deleteBusRegDetail,
    getGpsUnitRegDetail: getGpsUnitRegDetail

};