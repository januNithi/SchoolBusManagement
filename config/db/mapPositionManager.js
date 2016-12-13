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
        query = "select date(devicetime) as date,devicetime,latitude as lat,longitude as lng from positions ";
        query += " where date(devicetime) = (select MAX(date(devicetime)) from positions) and deviceid = 5";
        query += " order by devicetime ASC"
    }else {
        query = "select latitude,longitude,servertime as date from positions where date(servertime) ='"+date+"'";
        query += " and deviceid = "+id+"";
    }
    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            cb(null,results);
        }
    });
};