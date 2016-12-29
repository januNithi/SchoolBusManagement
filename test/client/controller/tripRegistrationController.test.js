
describe('Main Controller', function () {
    /*jshint expr:true */
    beforeEach(module('myApp'));

    var $controller,tripRegistrationService,busRegistrationService,driverRegistrationService;
    var $q;
    var deferred;

    beforeEach(inject(function(_$controller_,_$rootScope_,_$q_,_busRegistrationService_,_gpsUnitRegistrationService_,_driverRegistrationService_,_tripRegistrationService_,$httpBackend) {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        deferred = _$q_.defer();
        $controller = _$controller_;
        busRegistrationService=_busRegistrationService_;
        tripRegistrationService=_tripRegistrationService_;
        gpsUnitRegistrationService:_gpsUnitRegistrationService_;
        driverRegistrationService=_driverRegistrationService_;
        $controller('tripRegistrationController', {
            $scope: $scope
        });
        spyOn(tripRegistrationService, 'getTripRegData').and.returnValue(deferred.promise);
        spyOn(tripRegistrationService, 'postTripRegDetails').and.returnValue(deferred.promise);
        spyOn(tripRegistrationService, 'deleteTripRegDetails').and.returnValue(deferred.promise);

        $httpBackend.when("POST","/get/tripRegDetails").respond("sample");
        $httpBackend.when("POST","/get/postTripRegDetails").respond("sample");
        $httpBackend.when("POST","/get/deleteTableTripRegDetails").respond("sample");
    }));

    describe('main Controller', function () {
        it('check getTripRegDetails', function () {
            var $scope = {};
            var controller = $controller('tripRegistrationController', {$scope: $scope});
            $scope.getTripRegDetails();
            expect().not.toBeNull();
        });

        it('check getBusRegDetails', function () {
            var $scope = {};
            var controller = $controller('tripRegistrationController', {$scope: $scope});
            $scope.getBusRegDetails();
            expect().not.toBeNull();
        });

        it('check getDirverData', function () {
            var $scope = {};
            var controller = $controller('tripRegistrationController', {$scope: $scope});
            $scope.getDirverData();
            expect().not.toBeNull();
        });


        it('check getbusdata', function () {
            var $scope = {};
            var controller = $controller('tripRegistrationController', {$scope: $scope});
            $scope.getBusRegDetails();
            expect().not.toBeNull();
        });

        it('Add tripdata', function () {
            var $scope = {};
            var data={
                id: 27,
                trpName: 'gps',
                trpSession: 'EVENING',
                trpStart: '00:00:05',
                trpEnd: '00:00:01',
                rtId: 1,
                busId: 1,
                drvId: 1
            };
            var controller = $controller('tripRegistrationController', { $scope: $scope });

            $scope.add(data);
            expect().not.toBeNull();
        });

        it('delete tripdata', function () {
            var $scope = {};
            var data={
                data: 27
            };
            var controller = $controller('tripRegistrationController', { $scope: $scope });

            $scope.delete(data);
            expect().not.toBeNull();
        });

        it('Edit tripData', function () {
            var $scope = {};
            var data={
                regNo:'13',
                busCode:'Bus1',
                gpsUnit:'2',
                unitName: 'GPS1'
            };
            var controller = $controller('tripRegistrationController', { $scope: $scope });
            $scope.Edit(data);
            expect().not.toBeNull();
        });
        it('close modal', function () {
            var $scope = {};
            var controller = $controller('tripRegistrationController', { $scope: $scope });
            $scope.close();
            expect().not.toBeNull();
        });

        it('select menu', function () {
            var $scope = {};
            var data={

                value :'bus'

            };
            var controller = $controller('tripRegistrationController', { $scope: $scope });
            $scope.showSelectable(data);
            expect().not.toBeNull();
        });
    });
});

