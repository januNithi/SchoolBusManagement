/**
 * Created by CSS on 09-12-2016.
 */
var fs = require("fs");
var content = fs.readFileSync("./config/auth/config.json");
var configObj = JSON.parse(content);

var mysql = require('mysql');
var q=require('q');
var con = mysql.createPool(configObj.database);

exports.getBusPosition = function (data,cb) {
    
    var query = '';
    var count = 0;
    var resultData = [];
    for(var i = 0; i < Number(data.length); i++){
        query = "select "+data['id_'+i]+" as bus_id,latitude as lat,longitude as lng,date(devicetime) as date,devicetime,deviceid";
        query += " from positions where date(devicetime) ='"+data.date+"'";
        query += " and deviceid = (select gpsUnit from bus where id = "+data['id_'+i]+") order by devicetime ASC";
        con.query(query, function (err,results) {
            count++;
            if (err) {
                console.log(err);
                cb(err,null);
            } else {
                resultData.push(results);
                if(count == i){
                    cb(null,resultData);
                }
            }
        });
    }
    
    // var query = '';
    // if(id=='null' && date == 'null'){
    //     query = "select date(devicetime) as date,devicetime,deviceid,latitude as lat,longitude as lng from positions ";
    //     query += " where date(devicetime) = (select MAX(date(devicetime)) from positions where deviceid = 1) and deviceid = 1";
    //     query += " order by devicetime ASC";
    // }else {
    //     // query = "select latitude as lat,longitude as lng,date(devicetime) as date,deviceid";
    //     // query += " from positions where date(devicetime) ='"+date+"'";
    //     // query += " and deviceid = "+id+"";
    //
    //     query = "select latitude as lat,longitude as lng,date(devicetime) as date,devicetime,deviceid";
    //     query += " from positions where date(devicetime) ='"+date+"'";
    //     query += " and deviceid = (select gpsUnit from bus where id = "+id+") order by devicetime ASC";
    // }
    // console.log(query);
    // con.query(query, function (err,results) {
    //     if (err) {
    //         console.log(err);
    //         cb(err,null);
    //     } else {
    //         cb(null,results);
    //     }
    // });
};

exports.getMapPositionByApp = function (id,fromTime,toTime,cb)
{
    var query = '';
    if(fromTime == 'null' && toTime == 'null'){
        query = "select date(devicetime) as date,DATE_FORMAT(devicetime,'%X-%m-%d %H:%i:%s') as devicetime,deviceid,latitude as lat,longitude as lng from positions ";
        query += " where date(devicetime) = (select MAX(date(devicetime)) from positions where deviceid =";
        query += " (select gpsUnit from bus where id = "+id+")) and deviceid = (select gpsUnit from bus where id = "+id+")";
        query += " order by devicetime ASC";
        // query = "select date(devicetime) as date,DATE_FORMAT(devicetime,'%X-%m-%d %H:%i:%s') as devicetime,";
        // query += "deviceid,latitude as lat,longitude as lng from positions  where date(devicetime) =";
        // query += "'2017-01-07' and deviceid = 9 order by devicetime ASC";
    }else {
        // query = "select latitude as lat,longitude as lng,date(devicetime) as date,deviceid";
        // query += " from positions where date(devicetime) ='"+date+"'";
        // query += " and deviceid = "+id+"";

        query = "select latitude as lat,longitude as lng,date(devicetime) as date,";
        query += " DATE_FORMAT(devicetime,'%X-%m-%d %H:%i:%s') as devicetime,deviceid";
        query += " from positions where";
        // query += "  date(devicetime) ='"+date+"'  and";
        query += " devicetime between '"+fromTime+"' and '"+toTime+"'";
        query += " and deviceid = (select gpsUnit from bus where id = "+id+") order by devicetime ASC";
    }
    console.log(query);
    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            if(results.length > 0){
                cb(null,results);
            }else{
                exports.getMapPositionByApp(id,'null','null',function (err,result) {
                   if(err){
                       cb(err,null);
                   }else{
                       var data = [];
                       data.push(result[result.length-1]);
                       cb(err,data);
                   }
                });
            }

        }
    });
};