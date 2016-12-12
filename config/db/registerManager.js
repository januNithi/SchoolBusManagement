/**
 * Created by CSS on 09-12-2016.
 */
var mysql = require('mysql');
var q=require('q');
var db = require('../db');
var con = mysql.createConnection(db);

function getBusRegDetail() {

    var deferred = q.defer();
    var RegInfo = "select b.id,b.regNo,b.busCode,b.gpsUnit,g.unitName from bus as b left join gpsunit as g on g.id = b.gpsUnit";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            return deferred.reject(err);
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
            return deferred.reject(err);
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
            return deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

}

function getGpsUnitRegDetail() {

    var deferred = q.defer();
    var RegInfo = "select id,unitName,uniqueid from gpsunit";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            return deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};

function postGpsUnitRegDetail(data) {

    var deferred = q.defer();
    var RegInfo = "insert into gpsunit(unitName,uniqueid)values('"+data.unitName+"','"+data.uniqueid+"')";
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

function deleteGpsUnitRegDetail(data) {

    var deferred = q.defer();
    var RegInfo = "delete from gpsunit where id='"+data+"'";
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
function updateGpsUnitRegDetail(data) {

    var deferred = q.defer();
    var RegInfo = "update gpsunit set unitName='"+data.unitName+"',uniqueid='"+data.uniqueid+"' where id='"+data.id+"'";
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

function getTripRegDatas() {

    var deferred = q.defer();
    var RegInfo = "SELECT a.id,r.id AS routeId,r.rtName ,b.id AS busId,b.busCode,d.id AS driverId,d.drvName from trips as a LEFT JOIN routes as r ON a.id=r.id LEFT JOIN bus as b ON a.id=b.id LEFT JOIN drivers as d on a.id=d.id";
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

function getTableTripRegDatas() {

    var deferred = q.defer();
    var RegInfo = "SELECT id,trpName,trpSession,trpStart,trpEnd,rtId,busId,drvId from trips";
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

function postTripRegDatas(data) {

    var deferred = q.defer();
    var RegInfo = "insert into trips(trpName,trpSession,trpStart,trpEnd,rtId,busId,drvId) values('"+data.trpName+"','"+data.trpSession+"','"+data.trpStart+"','"+data.trpEnd+"','"+data.routeId+"','"+data.busId+"','"+data.driverId+"')";
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
function deleteTripRegDatas(data) {

    var deferred = q.defer();
    var RegInfo = "delete from trips where id='"+data+"'";
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
function updateTripRegDatas(data) {

    var deferred = q.defer();
    var RegInfo = "update trips set trpName='"+data.trpName+"',trpSession='"+data.trpSession+"',trpStart='"+data.trpStart+"',trpEnd='"+data.trpEnd+"',rtId='"+data.routeId+"',busId='"+data.busId+"',drvId='"+data.driverId+"' where id='"+data.id+"'";
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

function postDriverRegDatas(data) {

    var deferred = q.defer();
    var RegInfo = "insert into drivers(drvname,drvLicence,drvMob,drvPhoto)values('"+data.driverName+"','"+data.driverLiscence+"','"+data.mobNo+"','"+data.photo+"'); ";
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
    getGpsUnitRegDetail: getGpsUnitRegDetail,
    postGpsUnitRegDetail:postGpsUnitRegDetail,
    deleteGpsUnitRegDetail:deleteGpsUnitRegDetail,
    updateGpsUnitRegDetail:updateGpsUnitRegDetail,
    getTripRegDatas:getTripRegDatas,
    postTripRegDatas:postTripRegDatas,
    getTableTripRegDatas:getTableTripRegDatas,
    deleteTripRegDatas:deleteTripRegDatas,
    updateTripRegDatas:updateTripRegDatas,
    postDriverRegDatas:postDriverRegDatas

};