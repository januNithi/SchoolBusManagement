/**
 * Created by Administrator on 20.12.2016.
 */

module.exports=function(app) {

    var config=require('../controller/eventReport.server.controller');

    app.get('/report/eventReport', config.getEvents);



};