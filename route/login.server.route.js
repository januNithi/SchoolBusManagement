/**
 * Created by CSS on 22-12-2016.
 */

var LocalStrategy = require('passport-local').Strategy;

var config = require("../config/db/login");
var fs = require("fs");
var content = fs.readFileSync("./config/auth/config.json");
var configObj = JSON.parse(content);
var msg91 = require("msg91")(configObj.message.msg91.key, configObj.message.msg91.messageHeader, configObj.message.msg91.msgType);

var dateFormat = require("dateformat");

module.exports = function(app, passport) {

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'userName',
            passwordField : 'password',
            passReqToCallback : true, // allows us to pass back the entire request to the callback
            passResToCallback : true
        },
        function(req, userName, password, done) { // callback with email and password from our form

            config.authenticate(userName,password,function (err,result) {
                if (err) {
                    done(err);
                    req.res.send(500,{error:err});
                }else if(result.length == 0){
                    done(null,false);
                    req.res.send(401,"failure");
                }else{
                    req.session.user = result[0];
                    done(null, result[0]);
                    req.res.send(200,"success");
                }

               // all is well, return successful user

            });

        }));

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.post('/api/login', passport.authenticate('local-login', function (req,res) {




        })
    );

    app.get('/api/logout',function (req,res) {

        req.session.user = undefined;
        res.send("success");

    });

    app.get('/api/isUserLoggedIn',function (req,res) {

        if(req.session.user && req.session.user.id){
            res.send(req.session.user);
        }else{
            res.send('noUser');
        }

    });

    app.get('/getOTP',function (req,res) {

        config.verifyAppUser(req.query.userid,function (err,result) {

            if(err){
                res.send(500,{error:err});
            }else if(result.length == 0){
                res.send(401,"User Number Not Registered");
            }else {

                var otp = Math.floor(1000 + Math.random() * 9000);

                var msgBody = 'School Bus Management : The OTP to register is ' + otp + ' . Dont share with anyone';

                msg91.send(req.query.userid, msgBody, function (err, response) {
                    if (err)
                        res.send(500, {error: err});

                    var date = new Date();
                    var twentyMinutesLater = new Date(date.getTime() + (20 * 60 * 1000));
                    var day=dateFormat(twentyMinutesLater, "yyyy-mm-dd H:MM:ss");
                    config.newAppUser(otp, req.query.userid, day, function (err, result) {

                        if (err) {
                            res.send(500, {error: err});
                        }
                        res.send('Success');

                    });
                });
            }

        });

    });

    app.get('/verifyOTP',function (req,res) {

        var token = req.query.token;
        var userid = req.query.userid;
        var password = req.query.password;

        config.verifyOTPAppUser(req.query.otp, req.query.userid,function (err, result) {

            if (err) {
                res.send(500, {error: err});
            }else{
                if(result && result.length == 0){
                    res.send("OTP Doesn't Exist or Expired");
                }else {
                    var studentData = result[0];
                    config.updateToken(studentData.id,token,function (err,result) {
                        if(err){
                            res.send(500,{error:err});
                        }else{
                            config.updateAppUser(userid,password,function (err,result) {

                                if(err){
                                    res.send(500,{error:err});
                                }else{
                                    res.send(studentData);
                                }

                            });

                        }
                    });
                }
            }

        });

    });

};