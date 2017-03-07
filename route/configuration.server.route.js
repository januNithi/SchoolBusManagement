/**
 * Created by CSS on 04-03-2017.
 */

module.exports=function(app) {

    var config=require('../controller/config.server.controller');


    app.get('/config/getConfiguration', config.getConfiguration);
    app.post('/config/updateConfiguration', config.updateConfiguration);


};