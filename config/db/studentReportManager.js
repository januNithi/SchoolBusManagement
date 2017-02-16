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
    var query = "SELECT st.Name,st.id as studId,st.MobileNo,st.trip,b.busCode,b.id as busId,r.id as routeId,r.rtName,trp.id as trpId,trp.busId,trp.trpName,trp.drvId,d.drvName,d.drvMob from  ";
        query+="student st INNER JOIN trips trp on st.trip = trp.id INNER JOIN  bus b on trp.busId=b.id INNER JOIN drivers d on d.id=trp.drvId INNER JOIN  routes r on r.id=trp.rtId ";


    if(busId=='null' && tripId=='null' && routeId=='null') query+=' ORDER BY st.Name';
    else {
        query+=busId=='null'? " WHERE b.id=b.id" : " WHERE b.id="+busId;
        query+=tripId=='null'? " and trp.id=trp.id" : " and trp.id="+tripId;
        query+=routeId=='null'? " and r.id=r.id" : " and r.id="+routeId;

        query+=' ORDER BY st.Name';
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
    var query = "SELECT st.Name,st.id as studId,st.MobileNo,st.trip,b.busCode,b.id as busId,r.id as routeId,r.rtName,trp.id as trpId,trp.busId,trp.trpName,trp.drvId,d.drvName,d.drvMob from  ";
    query+="student st INNER JOIN trips trp on st.trip = trp.id INNER JOIN  bus b on trp.busId=b.id INNER JOIN drivers d on d.id=trp.drvId INNER JOIN  routes r on r.id=trp.rtId  WHERE st.Name like '"+stName+"%'";

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

