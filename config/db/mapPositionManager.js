/**
 * Created by CSS on 09-12-2016.
 */
var mysql = require('mysql');
var q=require('q');
var db = require('../db');
var con = mysql.createConnection(db);

exports.getBusPosition = function (id,date,cb) {
    var query = '';
    if(id=='null' && date == 'null'){
        query = "select date(devicetime) as date,devicetime,deviceid,latitude as lat,longitude as lng from positions ";
        query += " where date(devicetime) = (select MAX(date(devicetime)) from positions where deviceid = 1) and deviceid = 1";
        query += " order by devicetime ASC";
    }else {
        // query = "select latitude as lat,longitude as lng,date(devicetime) as date,deviceid";
        // query += " from positions where date(devicetime) ='"+date+"'";
        // query += " and deviceid = "+id+"";

        query = "select latitude as lat,longitude as lng,date(devicetime) as date,devicetime,deviceid";
        query += " from positions where date(devicetime) ='"+date+"'";
        query += " and deviceid = (select gpsUnit from bus where id = "+id+") order by devicetime ASC";
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