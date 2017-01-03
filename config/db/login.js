/**
 * Created by CSS on 22-12-2016.
 */
var mysql = require('mysql');
var db = require('../db');
var con = mysql.createConnection(db);

function authenticate(userName,password,cb) {
    var query = "Select id,userId,pwd,usrType from users where userId = '"+userName+"'";
    query += " and pwd = '"+password+"'";
    con.query(query,function (err,result) {
       if(err){
           cb(err,result);
       }
        cb(err,result);
    });
};

function newAppUser(otp,userNumber,validDateTime,cb) {

    var query = "Insert into otpmaster(number,generatedOTP,validTill)";
    // query += " values('"+userNumber+"','"+otp+"','DATE_FORMAT("+validDateTime+"','%T'))";
    query += " values('"+userNumber+"','"+otp+"','"+validDateTime+"')";

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }
        cb(err,result);

    });

};

function verifyAppUser(userNumber,cb) {

    var query = "Select id from student where MobileNo = '"+userNumber+"'";

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }
        cb(err,result);

    });

};

function verifyOTPAppUser(otp,userNumber,cb) {

    var query = "Select s.id,s.Name as studentName,s.Gender as studentGender,s.trip as tripId";
    query += " from otpmaster as o left join student as s  on s.MobileNo = o.number";
    query += " where o.generatedOTP = "+otp+" and o.number= " +userNumber+"";
    query += " and TIME(o.validTill) >= TIME(DATE_FORMAT(NOW(),'%r'))";

    console.log(query);

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }
        cb(err,result);

    });
};

function getUserDetails(userNumber,cb){

    var query = "Select "
    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }
        cb(err,result);

    });
};

function updateToken(id,token,cb) {

    var query = "Update student set token = '"+token+"' where id="+id;
    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }
        cb(err,result);

    });

}

module.exports = {
    authenticate : authenticate,
    newAppUser:newAppUser,
    verifyAppUser:verifyAppUser,
    verifyOTPAppUser:verifyOTPAppUser,
    updateToken:updateToken
};
