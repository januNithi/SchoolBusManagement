(function(){
    angular
        .module("myApp")
        .controller("eventReportController",eventReportController);

    eventReportController.$inject=[
        '$scope',
        '$window',
        'eventReportService',
        'leafletDrawEvents',
        'busRegistrationService',
        '$filter'

    ];
    function eventReportController($scope,$window,eventReportService,leafletDrawEvents,busRegistrationService,$filter) {

        $scope.map;


        $scope.events=[];
        $scope.filteredEvents=[];
        $scope.maxSize = 4;
        $scope.totalItems = 0;
        $scope.curpage = 1;
        $scope.itemspage = 10;

        $scope.busList=[];
        $scope.selDevice=[];
        $scope.selBus;
        $scope.selFrom;
        $scope.selTo;
        $scope.center = {
            lat: 11.0168,
            lng: 76.9558,
            zoom: 16
        };

        $scope.showSelectable = function (value) {

            if (value == 'eventReport') {
                return 'selected';
            }

        };
        $scope.isView=false;

        $scope.viewElement=function(){
            $scope.isView=!$scope.isView;
        };

        $scope.addDevice=function (item) {
            $scope.selDevice.push(item);
        };

        $scope.showReport=function(){

            loadEvents($scope.selBus.gpsUnit,$scope.selFrom,$scope.selTo);;
        };

        $scope.removeDevice=function (index) {
            $scope.selDevice.splice(index,0);

            console.log($scope.selDevice);
        };


        getBusRegDetails=function () {
            busRegistrationService.getBusRegData().then(function(result){
                $scope.busList=result.data;
            },function(err){
                console.log(err);
            });
        };

        loadEvents=function(id,from,to){

            var data={
                device:id,
                from:$filter('date')(from,'yyyy-MM-dd HH:mm:ss'),
                to:$filter('date')(to,'yyyy-MM-dd HH:mm:ss')
            };
            eventReportService.getEvents(data).then(function(result){

                $scope.events=result.data;

                $scope.totalItems = result.data.length;
                $scope.$watch('curpage + itemspage', function() {
                    var begin = (($scope.curpage - 1) * $scope.itemspage),
                        end = begin + $scope.itemspage;
                    $scope.filteredEvents = $scope.events.slice(begin, end);
                    $scope.updateMap(0);
                });

            },function(err){

            })

        };

        Array.prototype.remove = function() {
            var what, a = arguments, L = a.length, ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };


        // $scope.map = L.map('map', {
        //     center: [11.0168, 76.9558],
        //     zoom: 13
        // });

        $scope.markers=[];
        $scope.updateMap=function(id){

            $scope.markers=[];
            if(id>=0){
         
                for(i=0;i<$scope.filteredEvents.length;i++){
                     var icon1='images/green.png';
                    var icon2='images/dark.png';
                    var selIcon=icon2;
                    if(id==i){
                        alert(i);
                        selIcon=icon1;
                    }

                    else
                        selIcon=icon2;

                    // L.marker([Number($scope.filteredEvents[i].position.lat),Number($scope.filteredEvents[i].position.lon)]).addTo($scope.map);
                    $scope.markers.push({
                            lat: Number($scope.filteredEvents[i].position.lat),
                            lng: Number($scope.filteredEvents[i].position.lon),
                            icon: {
                                iconUrl: selIcon,
                                iconSize: [30, 30]
                            },
                            // focus: true,
                            message: $scope.filteredEvents[i].event.servertime,
                            draggable: true

                    });

                    $scope.center={
                        lat: Number($scope.filteredEvents[i].position.lat),
                        lng: Number($scope.filteredEvents[i].position.lon),
                        zoom: 16
                    }


                }
            }

        };



        // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap2525</a> contributors'
        // }).addTo($scope.map);

        getBusRegDetails();

    }
})();
