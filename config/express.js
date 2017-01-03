var express=require('express');

var bodyParser=require('body-parser');

var path=require('path');

var session = require('express-session');
var passport = require('passport');
var methodOverride = require('method-override');

module.exports=function(){
    
    var app=express();
    
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());

    app.use(methodOverride());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: 'developmentSessionSecret'
    }));

    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', 'http://localhost');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    var store = new session.MemoryStore();

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(session({ secret: 'something', store: store }));

    app.use(express.static('./public'));
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    // app.use(session({
    //     secret: 'keyboard cat',
    //     resave: false,
    //     saveUninitialized: true,
    //     cookie: { secure: true }
    // }))


    require('../route/register.server.route.js')(app);
    require('../route/mapPostion.server.route.js')(app);
    require('../route/geofence.server.route.js')(app);
    require('../route/report.server.route')(app);
    require('../route/clientApp.server.route')(app);
    require('../route/login.server.route')(app,passport);
    

    
    return app;
};