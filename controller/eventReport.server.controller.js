/**
 * Created by CSS on 10-12-2016.
 */

var eventReport = require('../config/db/eventReportManager');

exports.getEvents=function (req,res) {

console.log(req);
    var id=req.query.id;
    var from=req.query.from;
    var to=req.query.to;



    eventReport.getEvents(id,from,to,function (error,result) {



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



