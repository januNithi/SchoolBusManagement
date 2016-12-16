var express=require('./config/express');

var app=express();

var buses=[];

var socketDup;

var server=app.listen(3000,function(){

    var port=server.address().port;

    console.log("Server is running on Port "+port);

});

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

    buses.forEach(function (value,index) {


        if(value.gps_id == req.query.id){
            io.to(value.id).emit("bus position", req.query);
        }

    });



});




require('./route/layout.server.route.js')(app);

module.exports={
  app:app,
  server:server

};