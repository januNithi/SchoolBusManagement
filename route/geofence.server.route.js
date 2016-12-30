/**
 * Created by Administrator on 20.12.2016.
 */

module.exports=function(app) {

    var config=require('../controller/geofence.server.controller');
    app.post('/dao/geofenceData', config.geofenceRegister);
    app.get('/dao/getGeofences', config.getGeofences);
    app.get('/dao/getGeofenceById', config.getGeofenceById);
    app.delete('/dao/deleteGeofence/:id', config.deletGeofence);
    app.put('/dao/updateGeofence/:id', config.updateGeofence);

    app.post('/dao/mapGeofences', config.mapGeofenceData);
    app.get('/dao/getMapGeofenceById/:id', config.getMapGeofenceById);

    app.post('/not', config.notify);

    app.get('/dao/getGeofenceByUser/:id', config.getGeofenceByUser);



};