/**
 * Created by CSS on 29-12-2016.
 */
var mysql = require('mysql');
var db = require('../db');
var con = mysql.createPool(db);
var dateFormat = require('dateformat');

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

function updateNotificationStopdup(stops,studId,cb) {

    var query = "Delete from stop_notification where studId = "+studId;

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }else{
            var stopsString = stops.substr(1,stops.length-3);
            var stopsArr = stopsString.split(',');
            if(stopsArr.length != 0) {
                var query = "Insert into stop_notification(stopId,studId) VALUES ?";
                var values = [];
                stopsArr.forEach(function (value,index) {
                    values.push([Number(value),studId]);
                    if((index + 1) == stopsArr.length) {
                        con.query(query,[values], function (err, results) {
                            cb(err, "Success");
                        });
                    }
                });
            }else{
                cb(err,"No Stops Found");
            }
        }

    });

}

function getAppStartData(data,cb) {

    var query = "Select s.id as studId,s.trip,s.stop,(select stpName from stops where id = s.stop) as stopName,";
    query += "(Select id from users where usrType = 'parent' and userid = s.MobileNo) as userId,";
    query += "(Select gpsUnit from bus where id = (Select busId from trips where id = s.trip)) as gpsUnit,";
    query += "(Select group_concat(CONVERT(stopId,char(8))) from stop_notification where studId = s.id) as stop_notifyId";
    // from student as s where s.MobileNo = '9443887438'
    query += " from student as s where s.MobileNo = '"+data.userid+"'";
    // var query = "Select s.id as studId,s.trip,s.stop,(select stpName from stops where id = s.stop) as stopName,";
    // var query = "(Select id from users where usrType = 'parent' and userid = s.MobileNo) as userId";
    // query += " from student as s where MobileNo = '"+data.userid+"'";

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }else{
            cb(err,result);
        }

    });
}

function getUser(id,cb) {

    var query = "Select sn.id,sn.stopId,t.trpStart,t.trpEnd,s.token,s.id as studId from stop_notification as sn";
    query += " left join student as s on s.id = sn.studId left join trips as t";
    query += " on t.id = s.trip left join bus as b on b.id = t.busId where b.gpsUnit = "+id;

    con.query(query,function (err,result) {
       cb(err,result);
    });

}

function getNotificationTrip(cb) {
    var query = "Select t.trpStart,t.id,t.trpEnd,t.busId,b.busCode,b.gpsUnit,g.uniqueId,g.unitName from";
    query += " trips as t left join bus as b on t.busId = b.id left join gpsunit as g on b.gpsUnit=g.id";

    con.query(query,function (err,result) {
        cb(err,result);
    });
}

function getGeofenceUserDetails(deviceid,cb) {
    var query = "Select users.id,users.usrType,student.id as studId,student.Name,student.MobileNo,student.token ";
    query += "from users inner join student on student.MobileNo = users.userId and users.usrType = 'parent'";
    query += " inner join trips on student.trip = trips.id where trips.busId =";
    query += " (Select id from bus where bus.gpsUnit = "+deviceid+")";

    con.query(query,function (err,result) {
        cb(err,result);
    });
}

function getStopDetails(id,cb) {
    var query = "Select id,stpName,stpPosition from stops where id = "+id;

    con.query(query,function (err,result) {
        cb(err,result);
    });
}

function updateNotification(data,cb) {
    var query = "Insert into notification(message,gps,gpsUnit,bus_id,trip_id,date,dataRead)";
    query += " values('"+data.message+"','"+data.gps+"',"+data.gpsUnit;
    query += ","+data.bus_id+","+data.trip_id+",'"+data.date+"',"+0+")";

    con.query(query,function (err,result) {
        cb(err,result);
    });
}


function getAdminNotification(cb) {
    var query = "Select id,message,gps,gpsUnit,bus_id,(Select busCode from bus where id=bus_id) as busCode";
    query += " ,dataRead,date,trip_id from notification";

    con.query(query,function (err,result) {
        cb(err,result);
    });
}


function updateReadNotification(id,cb) {
    var query = "Update notification set dataRead = 1 where id = "+id;

    con.query(query,function (err,result) {
        cb(err,result);
    });
}

function updateParentNotification(data,cb) {
    var day=dateFormat(data.date, "yyyy-mm-dd h:MM:ss");
    var query = "Insert into parent_notification(studId,message,date)";
    query += " values('"+data.studId+"','"+data.message+"','"+day+"')";

    con.query(query,function (err,result) {
        cb(err,result);
    });
}

function getParentNotification(cb) {
    var query = "Select studId,message,date,(Select Name from Student where id = studId) as studentName";
    query += " from parent_notification order by date";

    con.query(query,function (err,result) {
        cb(err,result);
    });
}

module.exports = {
    updateNotificationStop:updateNotificationStop,
    getUser:getUser,
    getStopDetails:getStopDetails,
    getNotificationTrip:getNotificationTrip,
    getAppStartData:getAppStartData,
    updateNotificationStopdup:updateNotificationStopdup,
    updateNotification:updateNotification,
    getAdminNotification : getAdminNotification,
    updateReadNotification : updateReadNotification,
    updateParentNotification:updateParentNotification,
    getParentNotification:getParentNotification,
    getGeofenceUserDetails:getGeofenceUserDetails
};