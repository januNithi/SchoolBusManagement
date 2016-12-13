/**
 * Created by CSS on 10-12-2016.
 */
module.exports=function (app)
{
    var config=require('../controller/mapPosition.server.controller');
    app.get('/getMapPosition',config.mapPosition);
};