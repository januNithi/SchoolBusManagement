/**
 * Created by CSS on 09-12-2016.
 */
var mysql = require('mysql');
var q=require('q');
var db = require('../db');
var con = mysql.createConnection(db);


exports.getEvents = function (id,from,to,cb) {
    console.log(id);
    var query = "SELECT e.id,e.type,e.servertime,e.deviceid,e.positionid,e.geofenceid,e.attributes,d.unitName,p.id as posId,p.latitude,p.longitude from ";
        // query+="events e LEFT OUTER JOIN gpsunit d on d.id = e.deviceid LEFT OUTER  JOIN positions p on e.positionid=p.id WHERE e.deviceid IN ("+id+") and (e.servertime between '"+ from +"' and '"+to+"')";
        query+="events e left JOIN gpsunit d on d.id = e.deviceid left JOIN positions p on e.positionid=p.id ";

    if(id != 'null' && from != 'null' && to != 'null'){
        query += " WHERE e.deviceid in ("+id+") and (e.servertime between '"+ from +"' and '"+to+"')";
    }

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

