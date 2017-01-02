/**
 * Created by CSS on 09-12-2016.
 */
var mysql = require('mysql');
var q=require('q');
var db = require('../db');
var con = mysql.createConnection(db);

function getBusRegDetail() {

    var deferred = q.defer();
    var RegInfo = "select b.id,b.regNo,b.busCode,b.gpsUnit,g.unitName from bus as b left join gpsunit as g on g.id = b.gpsUnit";
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

function getTripRegDatas() {

    var deferred = q.defer();
    var RegInfo = "SELECT a.id,a.trpName,a.trpSession,a.trpStart,a.trpEnd,a.rtId,a.busId,a.drvId,r.rtName,b.busCode,d.drvName from trips as a LEFT JOIN routes as r ON a.rtId=r.id LEFT JOIN bus as b ON a.busId=b.id LEFT JOIN drivers as d on a.drvId=d.id";
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

function postTripRegDatas(data) {
    var RegInfo='';
    var deferred = q.defer();
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
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

};
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

function getStudentRegData()
{
    var deferred = q.defer();
    var RegInfo = "select s.id,s.Name,s.Gender,s.MobileNo,s.trip,t.id AS tripId,t.trpName from student as s left join trips as t on t.id = s.trip";
    con.query(RegInfo, function (err,results) {
        if (err) {
            console.log(err);
            deferred.reject(err);
        } else {

            deferred.resolve(results);
        }
    });
    return deferred.promise;

}

function postStudentRegData(data)
{
    var RegInfo='';
    var deferred = q.defer();
    if(data.id==undefined)
    {
         RegInfo = "INSERT INTO student(Name,Gender,MobileNo,trip) VALUES ('"+data.Name+"','"+data.Gender+"','"+data.MobileNo+"','"+data.tripId+"')";
    }
    else
    {

         RegInfo = "update student set Name='"+data.Name+"',Gender='"+data.Gender+"',MobileNo='"+data.MobileNo+"',trip='"+data.tripId+"' where id='"+data.id+"'";

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

function getRoutes(cb) {

    var routes = [];
    var i = 1;

    // var query = "Select routes.id as rtId,routes.rtName as routeName,stops.id as stpId,stops.stpName,";
    // query += " stops.stpPosition,stops.stpTime from routes left join stops on routes.id = stops.rtId";

    var query = "Select id,rtName from routes";
    con.query(query,function (err,result) {
        if(err){
            cb(err,result);
        }
        var totalLength = result.length;
        result.forEach(function (value,index) {

            query = "Select id,stpName,stpPosition,stpTime from stops where rtId = "+value.id+" order by time(stpTime) ASC";

            con.query(query,function (err,result) {
                if(err){
                    cb(err,result);
                }
                var data = {
                    id : value.id,
                    rtName : value.rtName,
                    stops : result
                }
                routes.push(data);
                if((i) == totalLength){
                    cb(err,routes);
                }
                i++;
            });

        });
    });

};

function updateRoutes(data,cb) {
    var query = "";
    var i = 1;
    if(data.id){
        query = "Update routes set rtName = '"+data.rtName+"' where id = "+data.id;
    }else{
        query = "Insert into routes(rtName) values('"+data.rtName+"')";
    }

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }else{

            var rtId = data.id;
            query = "delete from stops where rtId = "+rtId;
            con.query(query,function (err,result) {
              if(err){
                  cb(err,result);
              }else{

                  data.stops.forEach(function (value,index) {
                      query = "Insert into stops(stpName,stpPosition,stpTime,rtId)";
                      query += " values('"+value.stpName+"','"+JSON.stringify(value.stpPosition)+"','";
                      query += ""+value.stpTime+"',"+rtId+")";
                      con.query(query,function (err,result) {

                          if(err){
                              cb(err,result);
                          }else{
                              if(i == data.stops.length) {
                                  cb(err, result);
                              }
                              i++
                          }

                      });
                  });

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
    deleteStops:deleteStops

};