/**
 * Created by CSS on 09-12-2016.
 */
var mysql = require('mysql');
var q=require('q');
var db = require('../db');
var con = mysql.createConnection(db);


exports.getEvents = function (id,from,to,cb) {
    var query = "SELECT e.id,e.type,e.servertime,e.deviceid,e.positionid,e.geofenceid,e.attributes,d.unitName,p.id as posId,p.latitude,p.longitude from ";
        query+="events e INNER JOIN gpsunit d on d.id = e.deviceid INNER JOIN positions p on e.positionid=p.id WHERE e.deviceid="+id+" and (e.servertime between '"+ from +"' and '"+to+"')";

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

