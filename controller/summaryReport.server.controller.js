/**
 * Created by CSS on 10-12-2016.
 */

var eventReport = require('../config/db/summaryReportManager');
var excel = require('node-excel-export');

exports.getSummary=function (req,res) {



    var id=req.query.id;
    var objId=[];
    objId=JSON.parse(id);
    var from=req.query.from;
    var to=req.query.to;

    var arrayId=[];
    for(i=0;i<objId.length;i++){
        arrayId.push(objId[i].gpsUnit);
    }


    eventReport.getSummary(arrayId,from,to,function (error,result) {



        var response=[];

        if(error){
            res.send(500,{error:error});
        }else{
            for(i=0;i<result.length;i++){
                var data={
                    device:{},
                    position:{},
                    bus:{}
                };

                var  attribute=JSON.parse(result[i].attrib);

                data.device.name=result[i].unitName;
                data.device.id=result[i].id;

                data.position.id=result[i].deviceid;
                data.position.avgSpeed=result[i].avgspeed;
                data.position.maxSpeed=result[i].maxspeed;
                data.position.dist=attribute.distance;

                data.bus.busCode=result[i].busCode;
                data.bus.gpsUnit=result[i].gpsUnit;
                data.bus.busId=result[i].busId;

                response.push(data);

            }

            console.log(response);
            res.send(response);
        }

    });



};

exports.exportSummary= function(req, res){

    var id=req.query.id;
    var from=req.query.from;
    var to=req.query.to;

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
        deviceName: { // <- the key should match the actual data key
            displayName: 'Device Name', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            // cellStyle: function(value, row) { // <- style renderer function
            //     // if the status is 1 then color in green else color in red
            //     // Notice how we use another cell value to style the current one
            //     return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: 'FFFF0000'}}}; // <- Inline cell style is possible
            // },
            width: 400// <- width in pixels
        },
        distance: {
            displayName: 'Distance',
            headerStyle: styles.headerDark,
            // cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
            //     return (value == 1) ? 'Active' : 'Inactive';
            // },
            width: 200 // <- width in chars (when the number is passed as string)
        },
        averageSpeed: {
            displayName: 'Average Speed',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 200 // <- width in pixels
        },
        maxSpeed: {
            displayName: 'Max Speed',
            headerStyle: styles.headerDark,
            // cellStyle: styles.cellPink, // <- Cell style
            width: 200 // <- width in pixels
        }
    };

    var dataset = [];

    eventReport.getSummary(id,from,to,function (error,result) {
        if(error)
            res.send(500,{error:error});
        else {
                for(i=0;i<result.length;i++){
                    var  attribute=JSON.parse(result[i].attrib);
                    dataset.push({"deviceName":result[i].unitName,"distance":attribute.distance,"averageSpeed":result[i].avgspeed,"maxSpeed":result[i].maxspeed});

                }
            }

        var report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                    name: 'Summary Report', // <- Specify sheet name (optional)
                    // heading: heading, // <- Raw heading array (optional)
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );

        res.attachment('Summary Report.xlsx');
        res.send(report);


    });


};



