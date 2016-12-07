var express=require('./config/express');

var app=express();


var server=app.listen(3000,function(){

   var port=server.address().port;

    console.log("Server is running on Port "+port);


});

module.exports={

  app:app,
  server:server

};