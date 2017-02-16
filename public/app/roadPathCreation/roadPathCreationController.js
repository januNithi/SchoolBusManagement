/**
 * Created by CSS on 15-02-2017.
 */
(function () {

    angular.module('myApp').controller('roadPathCreationController',roadPathCreationController);

    roadPathCreationController.$inject = [
        '$scope',
        'leafletData',
        '$window',
        '$filter',
        'loginService',
        'leafletDrawEvents'
    ];

    function roadPathCreationController($scope,leafletData,$window,$filter,loginService,leafletDrawEvents) {

        var drawnItems = new L.FeatureGroup();
        angular.extend($scope, {
            map: {
                center: {
                    lat: 42.20133,
                    lng: 2.19110,
                    zoom: 11
                },
                drawOptions: {
                    position: "bottomright",
                    draw: {
                        polyline: {
                            metric: false,
                            shapeOptions: {
                                color: '#101820',
                                weight: 10,
                                opacity:1.0
                            }
                        }
                    },
                    edit: {
                        featureGroup: drawnItems,
                        remove: true
                    }
                }
            }
        });
        var handle = {
            created: function (e, leafletEvent, leafletObject, model, modelName) {
                drawnItems.addLayer(leafletEvent.layer);
            },
            edited: function (arg) {
            },
            deleted: function (arg) {
                var layers;
                layers = arg.layers;
                drawnItems.removeLayer(layer);
            },
            drawstart: function (arg) {
            },
            drawstop: function (arg) {
            },
            editstart: function (arg) {
            },
            editstop: function (arg) {
            },
            deletestart: function (arg) {
            },
            deletestop: function (arg) {
            }
        };
        var drawEvents = leafletDrawEvents.getAvailableEvents();
        drawEvents.forEach(function (eventName) {
            $scope.$on('leafletDirectiveDraw.' + eventName, function (e, payload) {
                //{leafletEvent, leafletObject, model, modelName} = payload
                var leafletEvent, leafletObject, model, modelName; //destructuring not supported by chrome yet :(
                leafletEvent = payload.leafletEvent, leafletObject = payload.leafletObject, model = payload.model,
                    modelName = payload.modelName;
                handle[eventName.replace('draw:', '')](e, leafletEvent, leafletObject, model, modelName);
            });
        });
    }
})();