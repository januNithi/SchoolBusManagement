/**
 * Created by CSS on 29-12-2016.
 */
module.exports=function(app) {
    var config = require('../controller/clientApp.server.controller');

    //------------- gpsUnit---------------------------//

    app.get('/get/updateNotificationStop', config.updateNotificationStop);
};