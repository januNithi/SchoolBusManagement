/**
 * Created by CSS on 09-12-2016.
 */
var fs = require("fs");
var content = fs.readFileSync("./config/auth/config.json");
var configObj = JSON.parse(content);

var mysql = require('mysql');
var q=require('q');
var con = mysql.createPool(configObj.database);


exports.getSummary = function (id,from,to,cb) {
    var query = "SELECT d.unitName,d.id,d.uniqueid,p.deviceid,p.servertime,avg(p.speed) as avgspeed, max(p.speed) as maxspeed,(select attributes from positions where deviceid IN ("+id+") and  positions.devicetime between '"+from+"' and '"+to+"' ORDER BY id ASC limit 1) as attributes1,(select attributes from positions where deviceid IN ("+id+") and positions.devicetime between '"+from+"' and '"+to+"' ORDER BY id DESC limit 1) as attributes2,b.busCode,b.gpsUnit,b.id as busId from ";
        query+="positions p left JOIN gpsunit d on d.id = p.deviceid left JOIN  bus b on b.gpsUnit=d.id WHERE p.deviceid IN ("+id+") and (p.devicetime between '"+from+"' and '"+to+"') group by  p.deviceid";

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

