
describe('tripRegistration Services', function () {

    var $controller,$factory;
    beforeEach(module('myApp'));



    beforeEach(inject(function($injector){
        $factory=$injector.get("tripRegistrationService");
    }));

    describe('get getTripRegData', function () {
        it('bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/tripRegDetails')
                .respond(200);
            var res = $factory.getTripRegData();
            expect($httpBackend.flush).not.toThrow();

        }));

        it('getGpsRegDetail function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/tripReg')
                .respond(200);
            var res = $factory.getTripRegData();
            expect($httpBackend.flush).toThrow();

        }));
    });

    describe('Add TripRegDetails', function () {
        it('Add bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/postTripRegDetails')
                .respond(200);

            var data={
                trpName: 'EVENINIG',
                trpSession: '2.00',
                trpStart: '00:00:05',
                trpEnd: '00:00:01',
                rtId: 1,
                busId: 1,
                drvId: 1

            };
            var res = $factory.postTripRegDetails(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('Add TripRegDetails function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/postTripReg')
                .respond(200);
            var data={
                trpName: 'EVENINIG',
                trpSession: '2.00',
                trpStart: '00:00:05',
                trpEnd: '00:00:01',
                rtId: 1,
                busId: 1,
                drvId: 1

            };
            var res = $factory.postTripRegDetails(data);
            expect($httpBackend.flush).toThrow();

        }));
    }); describe('Add TripRegDetails', function () {
        it('Add bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/postTripRegDetails')
                .respond(200);

            var data={
                trpName: 'EVENINIG',
                trpSession: '2.00',
                trpStart: '00:00:05',
                trpEnd: '00:00:01',
                rtId: 1,
                busId: 1,
                drvId: 1

            };
            var res = $factory.postTripRegDetails(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('Add TripRegDetails function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/postTripReg')
                .respond(200);
            var data={
                trpName: 'EVENINIG',
                trpSession: '2.00',
                trpStart: '00:00:05',
                trpEnd: '00:00:01',
                rtId: 1,
                busId: 1,
                drvId: 1

            };
            var res = $factory.postTripRegDetails(data);
            expect($httpBackend.flush).toThrow();

        }));
    });

    describe('update TripRegDetails', function () {
        it('Add bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/postTripRegDetails')
                .respond(200);

            var data={
                id:'27',
                trpName: 'EVENINIG',
                trpSession: '2.00',
                trpStart: '00:00:05',
                trpEnd: '00:00:01',
                rtId: 1,
                busId: 1,
                drvId: 1

            };
            var res = $factory.postTripRegDetails(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('update TripRegDetails function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/postTripReg')
                .respond(200);
            var data={
                id:'27',
                trpName: 'EVENINIG',
                trpSession: '2.00',
                trpStart: '00:00:05',
                trpEnd: '00:00:01',
                rtId: 1,
                busId: 1,
                drvId: 1

            };
            var res = $factory.postTripRegDetails(data);
            expect($httpBackend.flush).toThrow();

        }));
    });

    describe('deleteTripRegDetails', function () {
        it('Delete bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST', '/get/deleteTableTripRegDetails')
                .respond(200);

            var data = {
                data: 27
            };
            var res = $factory.deleteTripRegDetails(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('deleteTripRegDetails function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST', '/get/delete')
                .respond(200);
            var data = {
                data: 27
            };
            var res = $factory.deleteTripRegDetails(data);
            expect($httpBackend.flush).toThrow();

        }));


    });


    });
