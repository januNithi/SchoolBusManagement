/**
 * Created by CSS on 10-12-2016.
 */

var eventReport = require('../config/db/studentReportManager');
var excel = require('node-excel-export');
var request = require('request');

exports.getReport=function (req,res) {


    var busId=req.query.busId;
    var trpId=req.query.tripId;
    var routeId=req.query.routeId;

    eventReport.getReport(busId,trpId,routeId,function (error,result) {

        var response=[];

        if(error){
            res.send(500,{error:error});
        }else{
            for(i=0;i<result.length;i++){
                var data={
                    student:{},
                    route:{},
                    trip:{},
                    bus:{},
                    driver:{}
                };


                data.student.name=result[i].Name;
                data.student.studId=result[i].studId;
                data.student.mob=result[i].MobileNo;

                data.trip.trpId=result[i].trpId;
                data.trip.trpName=result[i].trpName;


                data.route.rtId=result[i].routeId;
                data.route.rtName=result[i].rtName;

                data.bus.busId=result[i].busId;
                data.bus.busCode=result[i].busCode;

                data.driver.drvId=result[i].drvId;
                data.driver.drvName=result[i].drvName;
                data.driver.drvMob=result[i].drvMob;

                response.push(data);

            }

            console.log(response);
            res.send(response);
        }

    });



};

exports.report=function (req,res) {


    var busId=req.query.busId;
    var trpId=req.query.tripId;
    var routeId=req.query.routeId;

    eventReport.getReport(busId,trpId,routeId,function (error,result) {

        var response=[];

        if(error){
            res.send(500,{error:error});
        }else {

            console.log(result);
            var data = {
                template: {"shortid": "Sk6X_DQHl", "recipe": "phantom-pdf"},
                data: {
                    "student": result

                }
            };
            var options = {
                uri: 'http://localhost:5488/api/report',
                method: 'POST',
                preview: 'true',
                json: data
            };

            request(options).pipe(res);
        }

    });



};


exports.getReportByName=function (req,res) {


    var stName=req.query.stName;


    eventReport.getReportByName(stName,function (error,result) {

        var response=[];

        if(error){
            res.send(500,{error:error});
        }else{
            for(i=0;i<result.length;i++){
                var data={
                    student:{},
                    route:{},
                    trip:{},
                    bus:{},
                    driver:{}
                };


                data.student.name=result[i].Name;
                data.student.studId=result[i].studId;
                data.student.mob=result[i].MobileNo;

                data.trip.trpId=result[i].trpId;
                data.trip.trpName=result[i].trpName;


                data.route.rtId=result[i].routeId;
                data.route.rtName=result[i].rtName;

                data.bus.busId=result[i].busId;
                data.bus.busCode=result[i].busCode;

                data.driver.drvId=result[i].drvId;
                data.driver.drvName=result[i].drvName;
                data.driver.drvMob=result[i].drvMob;

                response.push(data);

            }

            console.log(response);
            res.send(response);
        }

    });



};

exports.exportStudentReport= function(req, res){

    var busId=req.query.busId;
    var trpId=req.query.tripId;
    var routeId=req.query.routeId;


    var styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
        },
        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },
        cellGreen: {
            fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
            }
        }
    };

//Array of objects representing heading rows (very top)
    var heading = [
        [{value: 'a1', style: styles.headerDark}, {value: 'b1', style: styles.headerDark}, {value: 'c1', style: styles.headerDark}],
        ['a2', 'b2', 'c2'] // <-- It can be only values
    ];

//Here you specify the export structure
    var specification = {
        student: { // <- the key should match the actual data key
            displayName: 'Student', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            // cellStyle: function(value, row) { // <- style renderer function
            //     // if the status is 1 then color in green else color in red
            //     // Notice how we use another cell value to style the current one
            //     return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible
            // },
            width: 300// <- width in pixels
        },
        contact: {
            displayName: 'Contact',
            headerStyle: styles.headerDark,
            // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
            //     return (value == 1) ? 'Active' : 'Inactive';
            // },
            width: 300 // <- width in chars (when the number is passed as string)
        },
        bus: {
            displayName: 'Bus',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 300 // <- width in pixels
        },
        trip: {
            displayName: 'Trip',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 300 // <- width in pixels
        },
        route: {
            displayName: 'Route',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 300 // <- width in pixels
        },
        driver: {
            displayName: 'Driver',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 300 // <- width in pixels
        },
        driverMob: {
            displayName: 'Driver Mob',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 300 // <- width in pixels
        }

    };

    var dataset = [];

    eventReport.getReport(busId,trpId,routeId,function (error,result) {

        if(error)
            res.send(500,{error:error});
        else
        {
            for(i=0;i<result.length;i++){
                dataset.push({"student":result[i].Name,"contact":result[i].MobileNo,"bus":result[i].busCode,"trip":result[i].trpName,"route":result[i].rtName,"driver":result[i].drvName,"driverMob":result[i].drvMob});

            }

            var report = excel.buildExport(
                [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                    {
                        name: 'Student Report', // <- Specify sheet name (optional)
                        // heading: heading, // <- Raw heading array (optional)
                        specification: specification, // <- Report specification
                        data: dataset // <-- Report data
                    }
                ]
            );

            res.attachment('Student Report.xlsx');
            res.send(report);

        }


    });
};



