/**
 * Created by CSS on 09-12-2016.
 */
var fs = require("fs");
var content = fs.readFileSync("./config/auth/config.json");
var configObj = JSON.parse(content);

var mysql = require('mysql');
var q=require('q');
var con = mysql.createPool(configObj.database);


exports.getReport = function (busId,tripId,routeId,cb) {
    // var query = "SELECT st.Name,st.id as studId,st.MobileNo,st.trip,b.busCode,b.id as busId,r.id as routeId,r.rtName,trp.id as trpId,trp.busId,trp.trpName,trp.drvId,d.drvName,d.drvMob from  ";
    //     query+="student st INNER JOIN trips trp on st.trip = trp.id INNER JOIN  bus b on trp.busId=b.id INNER JOIN drivers d on d.id=trp.drvId INNER JOIN  routes r on r.id=trp.rtId ";

    var query = " Select student.Name, student.id as studId, student.MobileNo, student_trip.trip_id as tripId, ";
    query += " bus.busCode,bus.id as busId, routes.id as routeId, routes.rtName, trips.trpName,";
    query += " drivers.id as drvId, drivers.drvName, drivers.drvMob from student inner join student_trip on student.id =";
    query += " student_trip.stud_id inner join trips on trips.id=student_trip.trip_id inner join bus on";
    query += " bus.id = trips.busId inner join drivers on drivers.id = trips.drvId inner join routes";
    query += " on routes.id = trips.rtId";

    if(busId=='null' && tripId=='null' && routeId=='null') query+=' ORDER BY student.Name';
    else {
        query+=busId=='null'? " WHERE bus.id=bus.id" : " WHERE bus.id="+busId;
        query+=tripId=='null'? " and trips.id=trips.id" : " and trips.id="+tripId;
        query+=routeId=='null'? " and routes.id=routes.id" : " and routes.id="+routeId;

        query+=' ORDER BY student.Name';
    }


    console.log("query"+query);
    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            cb(null,results);
        }
    });
};

exports.getReportByName = function (stName,cb) {
    // var query = "SELECT st.Name,st.id as studId,st.MobileNo,st.trip,b.busCode,b.id as busId,r.id as routeId,r.rtName,trp.id as trpId,trp.busId,trp.trpName,trp.drvId,d.drvName,d.drvMob from  ";
    // query+="student st INNER JOIN trips trp on st.trip = trp.id INNER JOIN  bus b on trp.busId=b.id INNER JOIN drivers d on d.id=trp.drvId INNER JOIN  routes r on r.id=trp.rtId  WHERE st.Name like '"+stName+"%'";

    var query = " Select student.Name, student.id as studId, student.MobileNo, student_trip.trip_id as tripId, ";
    query += " bus.busCode,bus.id as busId, routes.id as routeId, routes.rtName, trips.trpName,";
    query += " drivers.id as drvId, drivers.drvName, drivers.drvMob from student inner join student_trip on student.id =";
    query += " student_trip.stud_id inner join trips on trips.id=student_trip.trip_id inner join bus on";
    query += " bus.id = trips.busId inner join drivers on drivers.id = trips.drvId inner join routes";
    query += " on routes.id = trips.rtId  WHERE student.Name like '"+stName+"%'";

    console.log(query);
    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            cb(null,results);
        }
    });
};

