
describe('gpsUnitRegistrationService Services', function () {

    var $controller,$factory;
    beforeEach(module('myApp'));



    beforeEach(inject(function($injector){
        $factory=$injector.get("gpsUnitRegistrationService");
    }));

    describe('get GpsRegDetails', function () {
        it('bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/gpsUnitData')
                .respond(200);
            var res = $factory.getGpsUnitData();
            expect($httpBackend.flush).not.toThrow();

        }));

        it('getGpsRegDetail function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/gpsUnit')
                .respond(200);
            var res = $factory.getGpsUnitData();
            expect($httpBackend.flush).toThrow();

        }));
    });

    describe('Add BusRegDetails', function () {
        it('Add bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/post/gpsUnitData')
                .respond(200);

            var data={
                unitName: 'Gps2', uniqueid: 7
            };
            var res = $factory.postGpsUnitData(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('Add BusRegDetails function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/post/gpsUnit')
                .respond(200);
            var data={
                unitName: 'Gps2', uniqueid: 7
            };
            var res = $factory.postGpsUnitData(data);
            expect($httpBackend.flush).toThrow();

        }));
    });

    describe('deleteGpsUnitData', function () {
        it('Delete bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST', '/post/deleteGpsUnitData')
                .respond(200);

            var data = {
                id: '13'
            };
            var res = $factory.deleteGpsUnitData(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('deleteGpsUnitData function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST', '/post/deleteGpsUnit')
                .respond(200);
            var data = {
                id: '13'
            };
            var res = $factory.deleteGpsUnitData(data);
            expect($httpBackend.flush).toThrow();

        }));


    });


    describe('updateGpsUnitData', function () {
        it('Delete bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST', '/post/updateGpsUnitData')
                .respond(200);

            var data = {
                id: 9, unitName: 'Gps1', uniqueid: 8
            };
            var res = $factory.updateGpsUnitData(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('updateGpsUnitData function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST', '/post/updateGpsUnit')
                .respond(200);
            var data = {
                id: 9, unitName: 'Gps1', uniqueid: 8
            };
            var res = $factory.updateGpsUnitData(data);
            expect($httpBackend.flush).toThrow();

        }));


    });
});
