/**
 * Created by CSS on 09-12-2016.
 */
var fs = require("fs");
var content = fs.readFileSync("./config/auth/config.json");
var configObj = JSON.parse(content);

var mysql = require('mysql');
var q=require('q');
var con = mysql.createPool(configObj.database);

exports.geofenceRegister = function (data,cb) {

    console.log(data);
    var query = "INSERT INTO geofences (name,description,area) values ('"+data.name+"','"+data.desc+"','"+data.area+"')";



    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {

            var qry="INSERT INTO user_geofence (userid,geofenceid) values ("+data.userId+","+results.insertId+")";
            console.log(qry);
            con.query(qry, function (err,results1) {
                if (err) {
                    console.log(err);
                    cb(err,null);
                }
                else {

                    var response={};
                    response.geofenceId=results.insertId;
                    cb(null,response);
                }

            })
        }
    });
};

exports.getGeofences = function (id,cb) {
    var query = "SELECT g.id,g.name,g.description,g.area,ug.userid from geofences g INNER JOIN user_geofence ug on ug.geofenceid=g.id where ug.userid="+id;

    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            cb(null,results);
        }
    });
};

exports.getGeofenceById = function (id,cb) {
    var query = "SELECT id,name,description,area from geofences where id="+id;

    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            cb(null,results);
        }
    });
};

exports.getGeofenceByUser = function (id,cb) {
    console.log(id);
    var query = "SELECT g.id,g.name,g.description,g.area,ug.userid from geofences g INNER JOIN user_geofence ug on ug.geofenceid=g.id where ug.userid="+id;

    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            console.log(results);
            cb(null,results);
        }
    });
};


exports.deleteGeofence = function (id,cb) {
    var query = "DELETE from geofences where id="+id;
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

exports.updateGeofence = function (id,data,cb) {
    var query = "UPDATE geofences set ? where id="+id;

    con.query(query,data, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            cb(null,results);
        }
    });
};

exports.mapGeofence = function (data,cb) {

    var values=[];

    for(i=0;i<data.geofenceId.length;i++)
    {

        values.push([data.gpsId,data.geofenceId[i]]);
    }
 console.log("vaaa"+values);
    var query = "INSERT INTO device_geofence (deviceid, geofenceid) VALUES ?";

    con.query(query,[values], function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            cb(null,results);
        }
    });
};

exports.deleteMapping = function (id,userid,cb) {

    var query = "DELETE FROM device_geofence WHERE deviceid="+id+" and geofenceid in (select geofenceid from user_geofence where userid="+userid+")";
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

exports.getGeofenceMapping = function (id,cb) {

    var query = "SELECT deviceid,geofenceid FROM device_geofence WHERE deviceid="+id;
    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            cb(null,results);
        }
    });
};

exports.getGeofenceMappingByUser = function (userId,cb) {

    var query = "SELECT deviceid,geofenceid FROM device_geofence WHERE geofenceid in (select geofenceid from user_geofence where userid="+userId+")";
    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,null);
        } else {
            cb(null,results);
        }
    });
};