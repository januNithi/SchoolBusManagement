/**
 * Created by CSS on 10-12-2016.
 */

var eventReport = require('../config/db/eventReportManager');
var excel = require('node-excel-export');
var request = require('request');

exports.report=function(req,res){

    var id=req.query.id;
    var objId=[];
    objId=JSON.parse(id);
    var from=req.query.from;
    var to=req.query.to;

    var arrayId=[];
    for(i=0;i<objId.length;i++){
        arrayId.push(objId[i].id);
    }



    eventReport.getEvents(arrayId,from,to,function (error,result) {

        var data={
            template:{"shortid":"r1ZRvDXHl","recipe" : "phantom-pdf"},
            data: {
                "events": result,
                "from":from,
                "to":to
            }
        };
        var options={
            uri:'http://localhost:5488/api/report',
            method:'POST',
            preview:'true',
            json:data
        };

        request(options).pipe(res);
    });



};

exports.getEvents=function (req,res) {


    var id=req.query.id;
    var objId=[];
    objId=JSON.parse(id);
    var from=req.query.from;
    var to=req.query.to;

    var arrayId=[];
    for(i=0;i<objId.length;i++){
        arrayId.push(objId[i].id);
    }



    eventReport.getEvents(arrayId,from,to,function (error,result) {



        var response=[];

        if(error){
            res.send(500,{error:error});
        }else{
            for(i=0;i<result.length;i++){
                var data={
                    device:{},
                    position:{},
                    event:{}
                };
                data.device.name=result[i].unitName;
                data.device.id=result[i].deviceid;

                data.position.id=result[i].posId;
                data.position.lat=result[i].latitude;
                data.position.lon=result[i].longitude;

                data.event.id=result[i].id;
                data.event.type=result[i].type;
                data.event.servertime=result[i].servertime;
                data.event.geofenceid=result[i].geofenceid;
                data.event.attributes=result[i].attributes;

                response.push(data);

            }

            console.log(response);
            res.send(response);
        }

    });

};


exports.exportEvents= function(req, res){

    var id=req.query.id;
    var objId=[];
    objId=JSON.parse(id);
    var from=req.query.from;
    var to=req.query.to;

    var arrayId=[];
    for(i=0;i<objId.length;i++){
        arrayId.push(objId[i].id);
    }


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
        time: { // <- the key should match the actual data key
            displayName: 'Date', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            // cellStyle: function(value, row) { // <- style renderer function
            //     // if the status is 1 then color in green else color in red
            //     // Notice how we use another cell value to style the current one
            //     return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible
            // },
            width: 200// <- width in pixels
        },
        deviceName: {
            displayName: 'Device Name',
            headerStyle: styles.headerDark,
            // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
            //     return (value == 1) ? 'Active' : 'Inactive';
            // },
            width: 400 // <- width in chars (when the number is passed as string)
        },
        type: {
            displayName: 'Type',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 200 // <- width in pixels
        },
        geofence: {
            displayName: 'Geofence',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 200 // <- width in pixels
        }
    };

    var dataset = [];

    eventReport.getEvents(arrayId,from,to,function (error,result) {
        if(error)
            res.send(500,{error:error});
        else {
            for(i=0;i<result.length;i++){
                dataset.push({"time":result[i].servertime,"deviceName":result[i].unitName,"type":result[i].type,"geofence":result[i].geofenceid});

            }
        }

        var report = excel.buildExport(
            [
                {
                    name: 'Event Report', // <- Specify sheet name (optional)
                    // heading: heading, // <- Raw heading array (optional)
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );

        res.attachment('Event Report.xlsx');
        res.send(report);


    });


};



