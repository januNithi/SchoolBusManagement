(function(){
    angular
        .module("myApp")
        .controller("geofenceRegistrationController",geofenceRegistrationController);

    geofenceRegistrationController.$inject=[
        '$scope',
        '$window',
        'geofenceRegistrationService',
        'leafletDrawEvents'


    ];

    function geofenceRegistrationController($scope,$window,geofenceRegistrationService,leafletDrawEvents){

        $scope.center = {
            lat:11.255632,
            lng:76.325255,
            zoom:18
        };



       function loadMap(){
           // var map = L.map('map' , {drawControl: true}).setView([11.505, 76.09], 7);
           // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
           //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
           // }).addTo(map);
           // FeatureGroup is to store editable layers
           // var drawnItems = new L.FeatureGroup();
           // map.addLayer(drawnItems);
           // var drawControl = new L.Control.Draw({
           //     edit: {
           //         featureGroup: drawnItems
           //     }
           // });
           // map.addControl(drawControl);


           var drawnItems = new L.FeatureGroup();
           angular.extend($scope, {
               map: {
                   center: {
                       lat: 11.20133,
                       lng: 76.19110,
                       zoom: 11
                   },
                   drawOptions: {
                       position: "bottomright",
                       draw: {
                           polyline: false,
                           polygon: {
                               metric: false,
                               showArea: true,
                               drawError: {
                                   color: '#b00b00',
                                   timeout: 1000
                               },
                               shapeOptions: {
                                   color: 'blue'
                               }
                           },
                           circle: {
                               showArea: true,
                               metric: false,
                               shapeOptions: {
                                   color: '#662d91'
                               }
                           },
                           marker: false
                       },
                       edit: false
                   }
               }
           });
           var handle = {
               created: function(e,leafletEvent, leafletObject, model, modelName) {
                   drawnItems.addLayer(leafletEvent.layer);
                   
               },
               edited: function(arg) {},
               deleted: function(arg) {
                   var layers;
                   layers = arg.layers;
                   drawnItems.removeLayer(layer);
               },
               drawstart: function(arg) {},
               drawstop: function(arg) {},
               editstart: function(arg) {},
               editstop: function(arg) {},
               deletestart: function(arg) {},
               deletestop: function(arg) {}
           };
           var drawEvents = leafletDrawEvents.getAvailableEvents();
           drawEvents.forEach(function(eventName){
               $scope.$on('leafletDirectiveDraw.' + eventName, function(e, payload) {
                   //{leafletEvent, leafletObject, model, modelName} = payload
                   var leafletEvent, leafletObject, model, modelName; //destructuring not supported by chrome yet :(
                   leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
                       modelName = payload.modelName;
                   handle[eventName.replace('draw:','')](e,leafletEvent, leafletObject, model, modelName);
               });
           });
       }

        loadMap();

    }
})();

