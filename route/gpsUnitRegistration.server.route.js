module.exports=function(app){
    var config=require('../controller/gpsUnitRegistration.server.controller');
    app.post('/get/gpsUnitData',config.gpsUnitRegDetails);
  

};