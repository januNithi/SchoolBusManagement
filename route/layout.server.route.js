module.exports=function (app) 
{
  var config=require('../controller/layout.server.controller');
  app.get('*',config.layout);
};