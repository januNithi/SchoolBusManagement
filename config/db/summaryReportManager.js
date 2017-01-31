/**
 * Created by CSS on 09-12-2016.
 */
var mysql = require('mysql');
var q=require('q');
var db = require('../db');
var con = mysql.createPool(db);


exports.getSummary = function (id,from,to,cb) {
    var query = "SELECT d.unitName,d.id,d.uniqueid,p.deviceid,p.servertime,avg(p.speed) as avgspeed, max(p.speed) as maxspeed,p.attributes as attrib,b.busCode,b.gpsUnit,b.id as busId from ";
        query+="positions p left JOIN gpsunit d on d.id = p.deviceid left JOIN  bus b on b.gpsUnit=d.id WHERE p.deviceid IN ("+id+") and (p.servertime between '"+ from +"' and '"+to+"') group by  p.deviceid";

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

