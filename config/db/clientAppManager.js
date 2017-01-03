/**
 * Created by CSS on 29-12-2016.
 */
var mysql = require('mysql');
var db = require('../db');
var con = mysql.createConnection(db);

function updateNotificationStop(stopId,studId,cb) {

    var query = "Delete from stop_notification where studId = "+studId;

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }else{
            if(stopId != 0) {
                query = "Insert into stop_notification(stopId,studId)";
                query += " values(" + stopId + "," + studId + ")";
                con.query(query, function (err, results) {

                    cb(err, results);

                });
            }else{
                cb(err,result);
            }
        }

    });

}

function getUser(id,cb) {

    var query = "Select sn.id,sn.stopId,t.trpStart,t.trpEnd,s.token from stop_notification as sn";
    query += " left join student as s on s.id = sn.studId left join trips as t";
    query += " on t.id = s.trip left join bus as b on b.id = t.busId where b.gpsUnit = "+id;

    con.query(query,function (err,result) {
       cb(err,result);
    });

}

function getNotificationTrip(cb) {
    var query = "Select t.trpStart,t.trpEnd,t.busId,b.busCode,b.gpsUnit,g.uniqueId,g.unitName from";
    query += " trips as t left join bus as b on t.busId = b.id left join gpsunit as g on b.gpsUnit=g.id";

    con.query(query,function (err,result) {
        cb(err,result);
    });
}

function getStopDetails(id,cb) {
    var query = "Select id,stpName,stpPosition,stpTime from stops where id = "+id;

    con.query(query,function (err,result) {
        cb(err,result);
    });
}

module.exports = {
    updateNotificationStop:updateNotificationStop,
    getUser:getUser,
    getStopDetails:getStopDetails,
    getNotificationTrip:getNotificationTrip
};