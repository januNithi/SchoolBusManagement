var express=require('express');

var bodyParser=require('body-parser');

var path=require('path');

var session = require('express-session');


module.exports=function(){
    
    var app=express();
    
    app.use(bodyParser.urlencoded({
        
        extended:true
        
    }));
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }))

    app.use(bodyParser.json());
    
    app.use(express.static('./public'));

    require('../route/register.server.route.js')(app);
    require('../route/layout.server.route.js')(app);


    
    return app;
};