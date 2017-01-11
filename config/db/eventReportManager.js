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

exports.getEventsChart = function (id,from,to,cb) {

    var query = "SELECT  A.type,A.deviceid ,sum(TIMESTAMPDIFF(MINUTE,A.servertime,B.servertime)) AS timedifference";
        query+=" FROM events A INNER JOIN events B ON B.id= (A.id+ 1) WHERE A.deviceid="+id+ " AND A.servertime between '"+from+ "' AND '"+to+"'  group by A.type,A.deviceid ORDER BY A.id DESC";



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

exports.getDelayChart = function (from,to,cb) {

    var query = "select table1.*,count(*) as count from(SELECT TIMEDIFF(TIME(n.date),t.trpStart) as timediff,n.bus_id,n.gpsUnit,MONTH(n.date) as selMonth ";
    query+=" FROM notification n INNER JOIN trips t on t.id=n.trip_id where n.date between '"+from+"' and '"+to+"' ) as table1 where table1.timediff > TIME('00:15:00') group by table1.bus_id,table1.selMOnth";

    
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

