/**
 * Created by CSS on 04-03-2017.
 */
var fs = require("fs");
var configFile = './config/auth/setting.json';


exports.getConfiguration = function (req,res) {
    var content = fs.readFileSync(configFile);
    var settingObj = JSON.parse(content);
    res.send(settingObj);

};

exports.updateConfiguration = function (req,res) {

    fs.writeFile(configFile, JSON.stringify(req.body), function (err) {
        if (err){
            console.log(err);
            res.send(500,{error:err});
        }else{
            // console.log(JSON.stringify(req.body));
            // console.log('writing to ' + configFile);
            res.send({status : 'Success'});
        }

    });
};