/**
 * Created by CSS on 29-12-2016.
 */
module.exports=function(app) {
    var config = require('../controller/clientApp.server.controller');

    //------------- gpsUnit---------------------------//

    app.get('/get/updateNotificationStop', config.updateNotificationStop);
    app.get('/get/updateNotificationStops',config.updateNotificationStopdup);
    app.get('/dao/updateNotificationRead',config.updateNotificationRead);
    app.get('/dao/adminNotification', config.getAdminNotifications);
    app.get('/dao/appStart',config.getAppStartData);
};