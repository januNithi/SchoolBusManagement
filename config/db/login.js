/**
 * Created by CSS on 22-12-2016.
 */

var fs = require("fs");
var content = fs.readFileSync("./config/auth/config.json");
var configObj = JSON.parse(content);

var mysql = require('mysql');
var con = mysql.createPool(configObj.database);

function authenticate(userName,password,cb) {
    var query = "Select id,userId,pwd,usrType from users where userId = '"+userName+"'";
    query += " and pwd = '"+password+"' and usrType = 'admin'";
    con.query(query,function (err,result) {
       if(err){
           cb(err,result);
       }else{
           cb(err,result);
       }
    });
};

function newAppUser(otp,userNumber,validDateTime,cb) {

    var query = "Insert into otpmaster(number,generatedOTP,validTill)";
    // query += " values('"+userNumber+"','"+otp+"','DATE_FORMAT("+validDateTime+"','%T'))";
    query += " values('"+userNumber+"','"+otp+"','"+validDateTime+"')";

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }else{
            cb(err,result);
        }


    });

};

function verifyAppUser(userNumber,cb) {

    var query = "Select id from student where MobileNo = '"+userNumber+"'";

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }else{
            cb(err,result);
        }


    });

};

function verifyOTPAppUser(otp,userNumber,cb) {

    var query = "Select s.id,s.Name as studentName,s.Gender as studentGender,s.trip as tripId";
    query += " from otpmaster as o left join student as s  on s.MobileNo = o.number";
    query += " where o.generatedOTP = "+otp+" and o.number= " +userNumber+"";
    query += " and o.validTill >= Date(NOW())";

    console.log(query);

    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }else{
            cb(err,result);
        }


    });
};

function updateAppUser(userid,password,cb){
    var query = "Select id from users where userid = '"+userid+"' and usrType ='parent'";
    con.query(query,function (err,result) {
        if(err){
            cb(err,result);
        }else{
            if(result.length > 0){
                query = "Update users set pwd = '"+password+"' where id = "+result[0].id;
            }else{
                query = "Insert into users(userid,pwd,usrType) values("+userid;
                query += ",'"+password+"','parent')";
            }
            con.query(query,function (err,result) {
                cb(err,result);
            });
        }
    });

}
//
// function getUserDetails(userNumber,cb){
//
//     var query = "Select "
//     con.query(query,function (err,result) {
//
//         if(err){
//             cb(err,result);
//         }
//         cb(err,result);
//
//     });
// };

function updateToken(id,token,cb) {

    var query = "Update student set token = '"+token+"' where id="+id;
    con.query(query,function (err,result) {

        if(err){
            cb(err,result);
        }else{
            cb(err,result);
        }

    });

}

module.exports = {
    authenticate : authenticate,
    newAppUser:newAppUser,
    verifyAppUser:verifyAppUser,
    verifyOTPAppUser:verifyOTPAppUser,
    updateToken:updateToken,
    updateAppUser:updateAppUser
};
