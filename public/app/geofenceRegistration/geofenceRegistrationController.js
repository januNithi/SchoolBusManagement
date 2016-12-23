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

        var map,shape;
       var circle={
            radius:'',
            lat:'',
            log:''

        };
        var layer=null;
        var geoType;
        var polygon=[];
        $scope.geofence={
            id:'',
            name:'',
            description:'',
            area:''
        };
        $scope.geofences=[];
        $scope.isEdit=false;

        $scope.showSelectable = function (value) {

            if(value == 'geofence'){
                return 'selected';
            }

        };


        
        $scope.postGeofencData=function(){


            if(geoType=='CIRCLE')
            {
                $scope.geofence={
                    name:$scope.geofence.name,
                    desc:$scope.geofence.description,
                    area:geoType+' ('+circle.lat+' '+circle.log+', '+circle.radius+')'
                };
            }
            else if(geoType=='POLYGON'){
                $scope.geofence={
                    name:$scope.geofence.name,
                    desc:$scope.geofence.description,
                    area:geoType+' ('+circle.lat+' '+circle.log+', '+circle.radius+')'
                };
            }

            if($scope.geofence.area==''){
                alert('please select valid geofence');
                return;
            }


            geofenceRegistrationService.postGeofenceData($scope.geofence).then(function(result){
                alert("success fully saved");
                getGeofences();
            },function(err){
                alert("error");
            });

            $scope.newGeofence();

        };

       var getGeofences=function(){
            geofenceRegistrationService.getGeofences().then(function(result){
                console.log(result.data);
                $scope.geofences=result.data;
            },function(err){
                console.log('error');
            });

        };

        $scope.delete=function(data){

            geofenceRegistrationService.deleteGeofence(data.id).then(function(result){
                getGeofences();
            },function(err){
                console.log('error');
            });

        };

        $scope.edit=function(id){


            if(layer!=null || layer=='data' ){

                if(layer=='data'){
                    map.removeLayer(shape);
                }
                else {
                    drawnItems.removeLayer(layer);
                    map.removeLayer(layer)
                }

            }

            $scope.isEdit=true;
            $scope.geofence=$scope.geofences[id];
            parseArea($scope.geofence.area);
            layer='data';

        };


        parseArea=function(area){

            var areaCircle=null,areaPolygon=null,areaType;
            areaCircle=area.indexOf("CIRCLE");
            areaPolygon=area.indexOf("POLYGON");

            if(areaCircle > -1){
                areaType='CIRCLE';
                var openBr=area.indexOf("(");

                var latlong=area.substring(openBr+1,area.length-1).split(' ');
                var lat=latlong[0];
                var lng=latlong[1].substring(0, latlong[1].length - 1);
                var rad=latlong[2];

                shape=L.circle([lat,lng], Number(rad)).addTo(map);
                map.panTo(new L.LatLng(lat,lng));

            }

            else if(areaPolygon > -1 ){
                areaType='POLYGON';
            }

        };

        $scope.newGeofence=function(){
            $scope.geofence={};
            if(layer=='data'){
                map.removeLayer(shape);
            }
            else {
                drawnItems.removeLayer(layer);
                map.removeLayer(layer)
            }
        };
        $scope.update=function(){



            if(geoType=='CIRCLE')
            {

                $scope.geofence.area=geoType+' ('+circle.lat+' '+circle.log+', '+circle.radius+')';

                console.log($scope.geofence);
            }
            else if(geoType=='POLYGON'){
                // $scope.geofence={
                //     name:$scope.geofence.name,
                //     desc:$scope.geofence.description,
                //     // area:geoType+' ('+circle.lat+','+circle.log+','+circle.radius+')'
                // };
            }

            if($scope.geofence.area==''){
                alert('please select valid geofence');
                return;
            }

            geofenceRegistrationService.updateGofence($scope.geofence).then(function(result){

                getGeofences();
            },function(err){
                console.log('error');
            });

            $scope.newGeofence();
        };

        map = L.map('map', {
            center: [11.0168, 76.9558],
            zoom: 13
        });

        L.tileLayer('http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap2525</a> contributors'
            }).addTo(map);

        var drawnItems = new L.FeatureGroup();
        var drawControl = new L.Control.Draw({

            position: 'topright',
            draw: {
                                polyline:false,
                                polygon:false,
                                circle: {
                                    showArea: true,
                                    metric: false,
                                    shapeOptions: {
                                        color: '#662d91'
                                    }
                                },
                                rectangle:false,
                                marker: false
                            }


        });


        map.addControl(drawControl);
        map.addLayer(drawnItems);

        map.on('draw:created', function (e) {

            if(layer!=null || layer=='data' ){

                if(layer=='data'){
                    map.removeLayer(shape);
                }
                else {
                    drawnItems.removeLayer(layer);
                    map.removeLayer(layer)
                }

            }



            var type = e.layerType;
                layer = e.layer;
            layer.addTo(map);
            geoType='';

            if(type=="circle") {
                circle.radius=layer.getRadius();
                circle.lat=layer.getLatLng().lat;
                circle.log=layer.getLatLng().lng;

                geoType='CIRCLE';
            }

            else if(type=='polygon'){

                polygon=layer.getLatLngs();
                geoType='POLYGON';

            }


        });


        getGeofences();

    }
})();

