var express=require('./config/express');
var FCM = require('fcm-node');
var app=express();
var config = require('./controller/clientApp.server.controller');
var geolib = require('geolib');

var serverKey = 'AAAAwDLf34Y:APA91bFPj38UR2AbkpqhblOOWg-vxkrfY2r5j2pEbg_OwjemLCWU5Iw-O1jYBaap-ZO3-wjx73vFMDaHQ6tbwpGu9lXmmDL0hQnl7_mLgkEbz2l0vHczXwdIIemtxl5kd0ftmN6NbNOOSmx3YLRNd8QD5lJaupqsMQ';
var fcm = new FCM(serverKey);

var buses=[];

var socketDup;

var obj = {
    lat : 11.01503823,
    log : 76.96040946
};

var server=app.listen(3000,function(){

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
                    divTime: req.query.divTime
                };
                io.sockets.socket(value.id).emit("bus position", obj);
                // io.(value.id).emit("bus position", req.query);
            }

        });
        stopReachAlgorithm(req.query);

    }

});

app.post('/busNotification',function (req,res) {
    console.log(req.body);
    // notificationAlgorithm(req.body);
    io.sockets.emit('notification', req.body);
});

function notificationAlgorithm(notificationData) {

    if(notificationData.event.type == 'deviceOnline'){
        
        config.checkTripTime(function (err,result) {

            if(err){
                console.log(err);
            }else{

                var data = result;

                data.forEach(function (value,index) {

                    if(value.gpsUnit == notificationData.device.id){

                        var minDate = new Date(value.trpStart);
                        var minTime = new Date(minDate.getTime() - (10 * 60 * 1000));
                        var maxDate = new Date(value.trpStart);
                        var maxTime = new Date(maxDate.getTime() + (10 * 60 * 1000));

                        var deviceTime = new Date(notificationData.position.deviceTime);

                        if(deviceTime > minTime && deviceTime < maxTime){
                            var data = {
                                message : 'Bus Started at '+deviceTime,
                                bus_id : value.busId,
                                gpsUnit : notificationData.device.id,
                                UniqueId: notificationData.device.UniqueId,
                                gps : notificationData.device.name
                            };
                            io.sockets.emit('Bus Start', notificationData);
                        }

                    }

                });

            }

        });
        
    }else if(notificationData.event.type == 'deviceOnline'){

        config.checkTripTime(function (err,result) {

            if(err){
                console.log(err);
            }else{

                var data = result;

                data.forEach(function (value,index) {

                    if(value.gpsUnit == notificationData.device.id){

                        var minDate = new Date(value.trpEnd);
                        var minTime = new Date(minDate.getTime() - (10 * 60 * 1000));
                        var maxDate = new Date(value.trpEnd);
                        var maxTime = new Date(maxDate.getTime() + (10 * 60 * 1000));

                        var deviceTime = new Date(notificationData.position.deviceTime);

                        if(deviceTime > minTime && deviceTime < maxTime){
                            var data = {
                                message : 'Bus Stopped at '+deviceTime,
                                bus_id : value.busId,
                                gpsUnit : notificationData.device.id,
                                UniqueId: notificationData.device.UniqueId,
                                gps : notificationData.device.name
                            };
                            io.sockets.emit('Bus Stop', notificationData);
                        }

                    }

                });

            }

        });

    }else{
        io.sockets.emit('notification', notificationData);
    }

}

function stopReachAlgorithm(stopReachData) {

    var data = stopReachData;

    config.sendNotification(stopReachData,function (err,result) {
        console.log(err);
        if(result.length > 0){
            console.log(result);
            result.forEach(function (value,index) {
                var stpPosition = JSON.parse(value.stop.stpPosition);
                // var stpPosition = {
                //     latitude : 11.023606431835102,
                //     longitude : 77.00283245612809
                // }
                if(geolib.isPointInCircle({latitude:data.lat,longitude:data.log}, stpPosition, 50)){
                    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                        to: value.token,
                        collapse_key: 'Stop Reached',

                        notification: {
                            title: 'Reached Stop',
                            body: 'Reached '+value.stop.stpName+' at '+(new Date(Number(data.divTime))).toLocaleTimeString(),
                        },
                        data : value
                    };

                    fcm.send(message, function(err, response){
                        if (err) {
                            console.log("Something has gone wrong!");
                        } else {
                            console.log("Successfully sent with response: ", response);
                        }
                    });
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