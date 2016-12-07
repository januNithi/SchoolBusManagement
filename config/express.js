var express=require('express');

var bodyParser=require('body-parser');

var path=require('path');

module.exports=function(){
    
    var app=express();
    
    app.use(bodyParser.urlencoded({
        
        extended:true
        
    }));

    app.use(bodyParser.json());
    
    app.use(express.static('./public'));
    
    require('../route/layout.server.route.js')(app);
    
    
    return app;
};