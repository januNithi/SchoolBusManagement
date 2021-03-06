/**
 * Created by CSS on 09-12-2016.
 */
var fs = require("fs");
var content = fs.readFileSync("./config/auth/config.json");
var configObj = JSON.parse(content);

var mysql = require('mysql');
var q=require('q');
var con = mysql.createPool(configObj.database);

function getBusRegDetail(cb) {


    var RegInfo = "select b.id,b.regNo,b.busCode,b.gpsUnit,g.unitName from bus as b left join gpsunit as g on g.id = b.gpsUnit";
    con.query(RegInfo, function (err,results) {
        if (err) {
            cb(err,results)
        } else {
            var data = results;
            var i = 1;
            if(data.length>0){
                data.forEach(function (value,index) {

                    var query = "Select type from events where servertime = ";
                    query += " (Select MAX(servertime) from events where events.deviceid = "+value.gpsUnit ;
                    query += " and (type = 'deviceOnline' OR type = 'deviceOffline'";
                    query += " OR type = 'deviceMoving' OR type = 'deviceStopped')) limit 1";

                    con.query(query,function (err,results) {

                        if(err){
                            cb(err,results);
                        }else{
                            if(results.length > 0){
                                value.status = results[0].type;
                                if(i == data.length){
                                    cb(err,data);
                                }
                            }else{
                                if(i == data.length){
                                    cb(err,data);
                                }
                            }

                        }
                        i++;

                    });

                });
            }else{
                cb(err,results);
            }

        }
    });


};

function postBusRegDetail(data) {

    var RegInfo='';
    var deferred = q.defer();
    if(data.id==undefined)
    {
         RegInfo = "insert into bus(regNo,busCode,gpsUnit)values('" + data.regNo + "','" + data.busCode + "','" + data.gpsUnit + "')";
    }
    else{

        RegInfo = "update bus set regNo='" + data.regNo + "',busCode='" + data.busCode + "',gpsUnit='" + data.gpsUnit + "' where id='"+data.id+"'";


    }
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            return deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};

function deleteBusRegDetail(data) {

    var deferred = q.defer();
    var RegInfo = "Delete from bus where id='"+data+"'";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            return deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

}

function getGpsUnitRegDetail() {

    var deferred = q.defer();
    var RegInfo = "select id,unitName,uniqueid from gpsunit";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            return deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};

function postGpsUnitRegDetail(data) {

    var deferred = q.defer();
    var RegInfo = "insert into gpsunit(unitName,uniqueid)values('"+data.unitName+"','"+data.uniqueid+"')";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};

function deleteGpsUnitRegDetail(data) {

    var deferred = q.defer();
    var RegInfo = "delete from gpsunit where id='"+data+"'";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};
function updateGpsUnitRegDetail(data) {

    var deferred = q.defer();
    var RegInfo = "update gpsunit set unitName='"+data.unitName+"',uniqueid='"+data.uniqueid+"' where id='"+data.id+"'";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};

function getTripRegDatas(tripId,cb) {

    var RegInfo = "SELECT a.id,a.trpName,a.trpSession,a.trpStart,a.trpEnd,a.rtId,a.busId,a.drvId,";
    RegInfo += " r.rtName,b.busCode,d.drvName from trips as a LEFT JOIN routes as r ON a.rtId=r.id";
    RegInfo += " LEFT JOIN bus as b ON a.busId=b.id LEFT JOIN drivers as d on a.drvId=d.id";

    if(tripId){
        RegInfo += " where a.id = "+tripId+"";
    }

    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,results);
        } else {

            var data = results;

            data.forEach(function (value,index) {

                var query = "Select time,stopId from stop_time where status = 'active' and tripId = "+value.id;

                con.query(query,function (err,result) {

                    if(err){
                        cb(err,result);
                    }else{
                        var stopList = result;
                        if(stopList.length > 0){
                            stopList.forEach(function (value1,index1) {
                                value['stop_'+value1.stopId] = value1.time;
                                var query = "Select stpName,id,stpPosition from stops where rtId = "+value.rtId;
                                con.query(query,function(err,result){
                                    if(err){
                                        if((index + 1) == data.length && (index1 + 1) == stopList.length){
                                            cb(err,result);
                                        }
                                    }else {
                                        value.stops = result;
                                        value.showStops = false;
                                        if((index + 1) == data.length && (index1 + 1) == stopList.length){
                                            cb(err, data);
                                        }
                                    }
                                });
                            });
                        }else{
                            if((index + 1) == data.length){

                                cb(err,data);

                            }
                        }
                    }
                });

            });

        }
    });

};

function postTripRegDatas(data,cb) {
    var RegInfo='';
    if(data.id==undefined)
    {
        RegInfo = "insert into trips(trpName,trpSession,trpStart,trpEnd,rtId,busId,drvId) values('" + data.trpName + "','" + data.trpSession + "','" + data.trpStart + "','" + data.trpEnd + "','" + data.rtId + "','" + data.busId + "','" + data.drvId + "')";
    }
    else{

        RegInfo = "update trips set trpName='" + data.trpName + "',trpSession='" + data.trpSession + "',trpStart='" + data.trpStart + "',trpEnd='" + data.trpEnd + "',rtId='" + data.rtId + "',busId='" + data.busId + "',drvId='" + data.drvId + "' where id='"+ data.id +"' ";

    }
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,results);
        } else {

            if(data.id){
                data.tripId = data.id;
            }else{
                data.tripId = results.insertId;
            }

            updateStopTime(data,function (err,result) {
                cb(err,results);
            });

        }
    });

};

function updateStopTime(data,cb) {
    var query = "Update stop_time set status = 'Marked as Deleted' where tripId = "+data.tripId;
    con.query(query,function (err,result) {
        if(err){
            cb(err,result);
        }else{
            data.stops.forEach(function (value,index) {
                query = "Insert into stop_time(tripId,stopId,time,status) values(";
                query += ""+data.tripId+","+value.id+",'"+data['stop_'+value.id]+"','active')";
                console.log(query);
                con.query(query,function (err,result) {
                    if(err){
                        cb(err,result);
                    }else{
                        if((index +1 )==data.stops.length) {
                            cb(err, result);
                        }
                    }

                });
            });
        }
    });
}

function deleteTripRegDatas(data) {

    var deferred = q.defer();
    var RegInfo = "delete from trips where id='"+data+"'";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};
function updateTripRegDatas(data) {

    var deferred = q.defer();
    var RegInfo = "update trips set trpName='"+data.trpName+"',trpSession='"+data.trpSession+"',trpStart='"+data.trpStart+"',trpEnd='"+data.trpEnd+"',rtId='"+data.routeId+"',busId='"+data.busId+"',drvId='"+data.driverId+"' where id='"+data.id+"'";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};

function postDriverRegDatas(data) {

    var RegInfo='';

    var deferred = q.defer();

    if(data.id=="undefined")
    {
         RegInfo = "insert into drivers(drvName,drvLicence,drvMob,drvPhoto)values('" + data.driverName + "','" + data.driverLicence + "','" + data.mobileNo + "','" + data.driverPhoto + "'); ";

    }
    else {

        RegInfo = "update drivers set drvname='" + data.driverName + "',drvLicence='" + data.driverLicence + "',drvMob='" + data.mobileNo + "',drvPhoto='" + data.driverPhoto + "' where id='" + data.id + "'";
    }

        con.query(RegInfo, function (err,results) {
            if (err) {
                console.log(err);
                deferred.reject(err);
            } else {

                deferred.resolve(results);
            }
        });
        return deferred.promise;




};

function getDriverRegData(){

    var deferred = q.defer();
    var RegInfo = "select id,drvName,drvLicence,drvMob,drvPhoto from drivers";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;


};

function deleteDriverRegData(data){

    var deferred = q.defer();
    var RegInfo = "delete from drivers where id='"+data.data+"'";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;


};

function getStudentRegData(cb)
{
    // var RegInfo = "select s.id,s.Name,s.Gender,s.MobileNo,s.trip,t.id AS tripId,t.trpName";
    // RegInfo += " from student as s left join trips as t on t.id = s.trip";

    // var query = "select s.id,s.Name,s.Gender,s.MobileNo,s.trip,s.stop as stopId,t.id AS tripId,t.trpName,";
    // query += " (select stpName from stops where id = s.stop) as stopName";
    // query += " from student as s left join trips as t on t.id = s.trip";

    var query = "SELECT student.id,student.Name,student.Gender,student.MobileNo,";
    query += " GROUP_CONCAT(CONVERT(student_trip.id,char(50)) SEPARATOR ', '";
    query += " ) AS tripsId,";
    query += " GROUP_CONCAT(CONVERT(student_trip.trip_id,char(50)) SEPARATOR ', '";
    query += " ) AS tripId, GROUP_CONCAT(t.trpName SEPARATOR ', ') AS trpName,";
    query += " GROUP_CONCAT(CONVERT(student_trip.stop_id,char(50)) SEPARATOR ', ') AS stopId,";
    query += " GROUP_CONCAT(CONVERT(stops.stpName,char(50))";
    query += " SEPARATOR ', ') AS stpName FROM student LEFT JOIN student_trip ON student_trip.stud_id = student.id";
    query += " left join trips as t on t.id = student_trip.trip_id left join stops on";
    query += " stops.id = student_trip.stop_id GROUP BY student.id";

    con.query(query, function (err,results) {
        if (err) {
            console.log(err);
            cb(err,results);
        } else {

            cb(err,results);
        }
    });


}

function postStudentRegData(data)
{
    var RegInfo='';
    var deferred = q.defer();
    if(data.id==undefined)
    {
         RegInfo = "INSERT INTO student(Name,Gender,MobileNo) VALUES ('"+data.Name;
         RegInfo += "','"+data.Gender+"','"+data.MobileNo+"')";
    }
    else
    {

         RegInfo = "update student set Name='"+data.Name+"',Gender='"+data.Gender;
         RegInfo +="',MobileNo='"+data.MobileNo+"' where id='"+data.id+"'";

    }

    console.log( RegInfo);
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};

function deleteStudentRegData(data){

    var deferred = q.defer();
    var RegInfo = "delete from student where id='"+data.data+"'";
    console.log(RegInfo);
    con.query(RegInfo, function (err,results) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(results);
        }
    });
    return deferred.promise;


};

function updateStudentTrip(trip,cb) {
    var query = '';
    if(trip.id) {
        query = "Update student_trip set stud_id = " + trip.stud_id + ", trip_id = " + trip.trip_id + "";
        query += ",stop_id = " + trip.stop_id+" where id = "+trip.id;
    }else{
        query = "Insert into student_trip(stud_id,trip_id,stop_id) values("+trip.stud_id+","+trip.trip_id+",";
        query += trip.stop_id+")";
    }

    con.query(query,function (err,result) {
        cb(err,result);
    })

}

function getRoutes(routeId,cb) {

    var routes = [];
    var i = 1;

    // var query = "Select routes.id as rtId,routes.rtName as routeName,stops.id as stpId,stops.stpName,";
    // query += " stops.stpPosition,stops.stpTime from routes left join stops on routes.id = stops.rtId";

    var query = "Select id,rtName,fromRoutePoints,toRoutePoints,fromPlaceId,toPlaceId from routes";
    if(routeId){
        query += " where id = "+routeId;
    }
    con.query(query,function (err,result) {
        console.log(err);
        console.log(result);
        if(err){
            cb(err,result);
        }

        var totalLength = result.length;
        if(totalLength > 0) {
            result.forEach(function (value, index) {

                query = "Select id,stpName,stpPosition from stops where rtId = " + value.id;

                con.query(query, function (err, result) {
                    if (err) {
                        if ((i) == totalLength) {
                            cb(err, result);
                        }
                        i++;
                    }else{
                        var data = {
                            id: value.id,
                            rtName: value.rtName,
                            fromRoutePoints : value.fromRoutePoints,
                            toRoutePoints : value.toRoutePoints,
                            fromPlaceId : value.fromPlaceId,
                            toPlaceId : value.toPlaceId,
                            stops: result
                        };
                        routes.push(data);
                        if ((i) == totalLength) {
                            cb(err, routes);
                        }
                        i++;
                    }

                });

            });
        }else{
            cb(err,"No data Matches ID");
        }
    });

};

function updateRoutes(data,cb) {
    var query = "";
    var i = 1;
    if(data.id){
        query = "Update routes set rtName = '"+data.rtName+"', fromRoutePoints = '";
        query += JSON.stringify(data.fromRoutePoints)+"', toRoutePoints = '";
        query += JSON.stringify(data.toRoutePoints)+"', fromPlaceId = '"+data.fromPlaceId+"'";
        query += ", toPlaceId = '"+data.toPlaceId+"' where id = "+data.id;
    }else{
        query = "Insert into routes(rtName,fromRoutePoints,toRoutePoints,fromPlaceId,toPlaceId) values('"+data.rtName;
        query += "','"+JSON.stringify(data.fromRoutePoints)+"','"+JSON.stringify(data.toRoutePoints);
        query += "','"+data.fromPlaceId+"','"+data.toPlaceId+"')";
    }

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }else{

            var rtId = 0;
            if(!data.id){
                rtId = result.insertId;
            }else{
                rtId = data.id
            }
            query = "delete from stops where rtId = "+rtId;
            con.query(query,function (err,result) {
              if(err){
                  cb(err,result);
              }else{

                  if(data.stops && data.stops.length) {

                      data.stops.forEach(function (value, index) {
                          query = "Insert into stops(stpName,stpPosition,rtId)";
                          query += " values('" + value.stpName + "','" + JSON.stringify(value.stpPosition) + "',";
                          query += rtId + ")";
                          con.query(query, function (err, result) {

                              if (err) {
                                  cb(err, result);
                              } else {
                                  if (i == data.stops.length) {
                                      cb(err, result);
                                  }
                                  i++
                              }

                          });
                      });
                  }else{
                      cb(err,result);
                  }

              }
            });

        }

    });


}

function deleteRoutes(data,cb) {

    var query = "Delete from routes where id = "+data.id;

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }

        query = "Delete from stops where rtId = "+data.id;

        con.query(query,function (err,result) {

            if(err){
                cb(err,result);
            }

            cb(err,result);

        });

    });

}

function deleteStops(data,cb) {

    var query = "Delete from stops where id = "+data.id;

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }
        cb(err,result);

    });

}

module.exports= {

    getBusRegDetail: getBusRegDetail,
    postBusRegDetail:postBusRegDetail,
    deleteBusRegDetail:deleteBusRegDetail,
    getGpsUnitRegDetail: getGpsUnitRegDetail,
    postGpsUnitRegDetail:postGpsUnitRegDetail,
    deleteGpsUnitRegDetail:deleteGpsUnitRegDetail,
    updateGpsUnitRegDetail:updateGpsUnitRegDetail,
    getTripRegDatas:getTripRegDatas,
    postTripRegDatas:postTripRegDatas,
    deleteTripRegDatas:deleteTripRegDatas,
    updateTripRegDatas:updateTripRegDatas,
    postDriverRegDatas:postDriverRegDatas,
    getDriverRegData:getDriverRegData,
    deleteDriverRegData:deleteDriverRegData,
    getStudentRegData:getStudentRegData,
    postStudentRegData:postStudentRegData,
    deleteStudentRegData:deleteStudentRegData,
    getRoutes:getRoutes,
    updateRoutes:updateRoutes,
    deleteRoutes:deleteRoutes,
    deleteStops:deleteStops,
    updateStudentTrip:updateStudentTrip

};