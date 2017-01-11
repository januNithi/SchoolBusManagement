/**
 * Created by Administrator on 20.12.2016.
 */

module.exports=function(app) {

    var config=require('../controller/eventReport.server.controller');
    var configSummary=require('../controller/summaryReport.server.controller');
    var configStudent=require('../controller/studentReport.server.controller');


    app.get('/report/eventReport', config.getEvents);
    app.get('/report/exportEvents', config.exportEvents);
    app.get('/report/exportEventsChart', config.getEventsChart);
    app.get('/report/delayChart', config.getDelayChart);
    
    app.get('/report/summaryReport', configSummary.getSummary);
    app.get('/report/exportSummary', configSummary.exportSummary);

    app.get('/report/studentReport', configStudent.getReport);
    app.get('/report/exportStudentReport', configStudent.exportStudentReport);
    app.get('/report/studentReportByName', configStudent.getReportByName);




    app.get('/report/js', config.report);


};