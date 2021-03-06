var express=require('./config/express');
var FCM = require('fcm-node');
var app=express();
var config = require('./controller/clientApp.server.controller');
var geolib = require('geolib');
var dateFormat = require('dateformat');
var fs = require('fs');

var content = fs.readFileSync("./config/auth/config.json");
var configObj = JSON.parse(content);


var fcm = new FCM(configObj.fcm.serverKey);

var buses=[];

var socketDup;

var notifications = [];

var obj = {
    lat : 11.01503823,
    log : 76.96040946
};

var server=app.listen(configObj.server.port,function(){

    var port=server.address().port;

    console.log("Server is running on Port "+port);

});


/*

var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'dBAgDqYl1W4:APA91bGdM8cFXM7TTTjBnSbGZ08GXzzwJ_DFnvSPsxJlvYLcpZkIYDzbK1X-kfmuQbo7flEkHjz6InD-kkj-WyiEcbbcQE5mhM_wUHduKgU_Gg3gCWhl_HoTCCT2zipqL5vDwn432skR',
    collapse_key: 'Hello',

    notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
    },

    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};

fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});


*/


var io = require('socket.io').listen(server);

io.set('log level',0);

io.on('connection',function(socket){

    socket.on('bus track',function(busData){

        buses.push({id: socket.id, date:busData.date, gps_id:busData.gpsUnit});
        socketDup = socket;

    });

    socket.on('stop track',function (busData) {

        buses.forEach(function (value,index) {

            if(value.id == socket.id){
                buses.splice(index, 1);
            }

        });

    });

});

app.get('/busPositionChange',function (req,res) {

    console.log(req.query);

    if(req.query.Valid) {

        buses.forEach(function (value, index) {

            if (value.gps_id == req.query.id) {
                // var locdat =  new Date(Number(req.query.divTime)).toLocaleDateString();
                // var locTime = new Date(Number(req.query.divTime)).toLocaleTimeString();
                var obj = {
                    lat: req.query.lat,
                    lng: req.query.log,
                    UniqueId: req.query.UniqueId,
                    divTime: req.query.divTime,
                    deviceId : req.query.id,
                    altitude : req.query.altitude,
                    course : req.query.course
                };
                io.sockets.socket(value.id).emit("bus position", obj);
                // io.(value.id).emit("bus position", req.query);
                // io.sockets.sockets[value.id].emit("bus position", obj);

            }

        });
        stopReachAlgorithm(req.query);

    }

});

app.post('/busNotification',function (req,res) {
    console.log(req.body);
    io.sockets.emit('notification', req.body);
    notificationAlgorithm(req.body);
    // io.sockets.emit('notification', req.body);
});
// var notificationObj = { event:id
// { serverTime: '2017-01-07T12:23:55.103+05:30',
//     positionId: 0,
//     geofenceId: 0,
//     type: 'deviceOnline',
//     deviceId: 1,
//     id: 24274,
//     attributes: {} },
//     device:
//     { name: 'Janani',
//         status: 'unknown',
//         groupId: 0,
//         uniqueId: '100',
//         lastUpdate: '2017-01-07T11:47:42.102+05:30',
//         positionId: 0,
//         geofenceIds: [],
//         id: 1,
//         attributes: {} } };
// notificationAlgorithm(notificationObj);

function notificationAlgorithm(notificationData) {

    if(notificationData.event.type == 'deviceOnline'){

        config.checkTripTime(function (err,result) {

            if(err){
                console.log(err);
            }else{

                var data = result;

                data.forEach(function (value,index) {

                    if(value.gpsUnit == notificationData.device.id){

                        // var minDate = new Date(value.trpStart);
                        var minDate = new Date(new Date().toLocaleDateString()+' '+value.trpStart);//IF trpStart is TIME
                        var minTime = minDate.getTime() - (10 * 60 * 1000);
                        var maxDate = new Date(new Date().toLocaleDateString()+' '+value.trpStart);
                        var maxTime = maxDate.getTime() + (10 * 60 * 1000);

                        // var deviceTime = new Date(notificationData.position.deviceTime);

                        var date = new Date();

                        if(date.getTime() > minTime && date.getTime() < maxTime){
                            var data = {
                                message : 'Bus Started on '+ date.toLocaleTimeString(),
                                bus_id : value.busId,
                                gpsUnit : notificationData.device.id,
                                gps : notificationData.device.name,
                                date : dateFormat(date, "yyyy-mm-dd h:MM:ss"),
                                trip_id : value.id
                            };
                            config.updateNotification(data,function (err,result) {

                                if(err){
                                    console.log(err);
                                }else{
                                    config.getAdminNotification(function (err,result) {
                                        if(err){
                                            console.log(err);
                                        }else{
                                            io.sockets.emit('adminNotification', result);
                                        }
                                    });
                                }

                            });
                        }else{

                            var data = {
                                message : 'Bus Started on '+ date.toLocaleTimeString() + ' Had a Delay/BreakDown/Traffic',
                                bus_id : value.busId,
                                gpsUnit : notificationData.device.id,
                                gps : notificationData.device.name,
                                date : dateFormat(date, "yyyy-mm-dd h:MM:ss"),
                                trip_id : value.id
                            };
                            config.updateNotification(data,function (err,result) {

                                if(err){
                                    console.log(err);
                                }else{
                                    config.getAdminNotification(function (err,result) {
                                        if(err){
                                            console.log(err);
                                        }else{
                                            io.sockets.emit('adminNotification', result);
                                        }
                                    });
                                }

                            });

                        }

                    }

                });

            }

        });

    }else if(notificationData.event.type == 'deviceOffline'){

        config.checkTripTime(function (err,result) {

            if(err){
                console.log(err);
            }else{

                var data = result;

                data.forEach(function (value,index) {

                    if(value.gpsUnit == notificationData.device.id){

                        // var minDate = new Date(value.trpStart);
                        var minDate = new Date(new Date().toLocaleDateString()+' '+value.trpEnd);
                        var minTime = minDate.getTime() - (10 * 60 * 1000);
                        var maxDate = new Date(new Date().toLocaleDateString()+' '+value.trpEnd);
                        var maxTime = maxDate.getTime() + (10 * 60 * 1000);

                        // var deviceTime = new Date(notificationData.position.deviceTime);

                        var date = new Date();

                        if(date.getTime() > minTime && date.getTime() < maxTime){
                            var data = {
                                message : 'Bus Stopped on '+date.toLocaleTimeString(),
                                bus_id : value.busId,
                                gpsUnit : notificationData.device.id,
                                gps : notificationData.device.name,
                                date : dateFormat(date, "yyyy-mm-dd h:MM:ss"),
                                trip_id : value.id
                            };
                            config.updateNotification(data,function (err,result) {

                                if(err){
                                    console.log(err);
                                }else{
                                    config.getAdminNotification(function (err,result) {
                                        if(err){
                                            console.log(err);
                                        }else{
                                            io.sockets.emit('adminNotification', notificationData);
                                        }
                                    });
                                }

                            });

                        }else{

                            var data = {
                                message : 'Bus Stopped on '+date.toLocaleTimeString()+ '! Had a Delay/BreakDown/Traffic',
                                bus_id : value.busId,
                                gpsUnit : notificationData.device.id,
                                gps : notificationData.device.name,
                                date : dateFormat(date, "yyyy-mm-dd h:MM:ss"),
                                trip_id : value.id
                            };
                            config.updateNotification(data,function (err,result) {

                                if(err){
                                    console.log(err);
                                }else{
                                    config.getAdminNotification(function (err,result) {
                                        if(err){
                                            console.log(err);
                                        }else{
                                            io.sockets.emit('adminNotification', notificationData);
                                        }
                                    });
                                }

                            });

                        }

                    }

                });

            }

        });

    }else if(notificationData.event.type == 'geofenceEnter' || notificationData.event.type == 'geofenceExit'){
        config.getUserId(notificationData.event.deviceId,function (err,result) {
            if(err){
                console.log(err);
            }else{
                var data = result;
                data.forEach(function (value,index) {
                    config.getUserId(notificationData.event.geofenceId,value.id,function (err,results) {
                        if(err){
                            console.log(err);
                        }else{
                            if(results.length > 0){
                                if(value.usrType == 'parent'){
                                    if(value.token) {
                                        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                            to: value.token,
                                            collapse_key: notificationData.event.type,
                                            notification: {
                                                title: notificationData.event.type,
                                                body: notificationData.geofence.name + ' ' + notificationData.event.type + ' on ' + (new Date(notificationData.position.deviceTime)).toLocaleTimeString(),
                                            },
                                            data: value
                                        };
                                        var obj = {
                                            message: message.notification.body,
                                            date: new Date(notificationData.position.deviceTime),
                                            studId: value.studId
                                        };
                                        fcm.send(message, function (err, response) {
                                            if (err) {
                                                console.log("Something has gone wrong!");
                                            } else {
                                                console.log("Successfully sent with response: ", response);

                                                config.updateParentNotification(obj, function (err, result) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        console.log(result);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }else{
                                    var data = {
                                        message : notificationData.geofence.name + ' ' + notificationData.event.type + ' on ' + (new Date(notificationData.position.deviceTime)).toLocaleTimeString(),
                                        bus_id : value.busId,
                                        gpsUnit : notificationData.device.id,
                                        gps : notificationData.device.name,
                                        date : dateFormat(new Date(notificationData.position.deviceTime), "yyyy-mm-dd h:MM:ss"),
                                        trip_id : value.tripId
                                    };
                                    config.updateNotification(data,function (err,result) {

                                        if(err){
                                            console.log(err);
                                        }else{
                                            config.getAdminNotification(function (err,result) {
                                                if(err){
                                                    console.log(err);
                                                }else{
                                                    io.sockets.emit('adminNotification', notificationData);
                                                }
                                            });
                                        }

                                    });
                                }

                            }
                        }
                    });
                });
            }
        });
    }

}

function stopReachAlgorithm(stopReachData) {

    var data = stopReachData;

    config.sendNotification(stopReachData,function (err,result) {
        console.log(err);
        if(result && result.length > 0){
            // console.log(result);

            result.forEach(function (value,index) {
                if(value.stop){
                    var stpPosition = JSON.parse(value.stop.stpPosition);
                    // var stpPosition = {
                    //     latitude : 11.023606431835102,
                    //     longitude : 77.00283245612809
                    // }
                    if(geolib.isPointInCircle({latitude:data.lat,longitude:data.log}, stpPosition, 50)){

                        if(notifications.length){
                            notifications.forEach(function (value1,index1) {
                                if(value1.tripId == value.tripId && value1.stopId == value.stopId && value1.studId == value.studId){
                                    console.log("Notifications Already Send");
                                }else{
                                    if((index1+1) == notifications.length){
                                        notifications.push(value);
                                        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                            to: value.token,
                                            collapse_key: 'Stop Reached',

                                            notification: {
                                                title: 'Reached Stop',
                                                body: 'Reached '+value.stop.stpName+' on '+(new Date(Number(data.divTime))).toLocaleTimeString(),
                                            },
                                            data : value
                                        };
                                        var obj = {
                                            message : message.notification.body,
                                            date : new Date(Number(data.divTime)),
                                            studId
                                                : value.studId
                                        };
                                        fcm.send(message, function(err, response){
                                            if (err) {
                                                console.log("Something has gone wrong!");
                                            } else {
                                                console.log("Successfully sent with response: ", response);

                                                config.updateParentNotification(obj,function (err,result) {
                                                    if(err){
                                                        console.log(err);
                                                    }else{
                                                        console.log(result);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }


                            });
                        }else{
                            notifications.push(value);
                            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                to: value.token,
                                collapse_key: 'Stop Reached',

                                notification: {
                                    title: 'Reached Stop',
                                    body: 'Reached '+value.stop.stpName+' on '+(new Date(Number(data.divTime))).toLocaleTimeString(),
                                },
                                data : value
                            };
                            var obj = {
                                message : message.notification.body,
                                date : new Date(Number(data.divTime)),
                                studId
                                    : value.studId
                            };
                            fcm.send(message, function(err, response){
                                if (err) {
                                    console.log("Something has gone wrong!");
                                } else {
                                    console.log("Successfully sent with response: ", response);

                                    config.updateParentNotification(obj,function (err,result) {
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log(result);
                                        }
                                    });
                                }
                            });
                        }


                    }
                }
            });
        }
    });
}


require('./route/layout.server.route.js')(app);

module.exports={
    app:app,
    server:server

};