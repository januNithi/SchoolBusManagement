/**
 * Created by Administrator on 21.06.2016.
 */
/**
 * Created by Administrator on 6/1/2016.
 */

/**
 * Created by Administrator on 6/1/2016.
 */

describe('busRegistrationService Services', function () {

    var $controller,$factory;
    beforeEach(module('myApp'));


    

    beforeEach(inject(function($injector){
        $factory=$injector.get("busRegistrationService");
    }));

    describe('get BusRegDetails', function () {
        it('bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/busRegDetails')
                .respond(200);
            var res = $factory.getBusRegData();
            expect($httpBackend.flush).not.toThrow();

        }));

        it('BusRegDetails function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/busReg')
                .respond(200);
            var res = $factory.getBusRegData();
            expect($httpBackend.flush).toThrow();

        }));
    });

    describe('Add BusRegDetails', function () {
        it('Add bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/post/busRegDetails')
                .respond(200);

            var data={
                regNo:'13',
                busCode:'Bus1',
                gpsUnit:'2',
                unitName: 'GPS1'
            };
            var res = $factory.addBusRegData(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('Add BusRegDetails function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/post/busReg')
                .respond(200);
            var data={
                regNo:'13',
                busCode:'Bus1',
                gpsUnit:'2',
                unitName: 'GPS1'
            };
            var res = $factory.addBusRegData(data);
            expect($httpBackend.flush).toThrow();

        }));
    });

    describe('Delete BusRegDetails', function () {
        it('Delete bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/post/deleteBusRegDetails')
                .respond(200);

            var data={
                id:'13'
            };
            var res = $factory.deleteBusRegData(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('Delete BusRegDetails function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/post/deleteBusReg')
                .respond(200);
            var data={
                id:'13'
            };
            var res = $factory.deleteBusRegData(data);
            expect($httpBackend.flush).toThrow();

        }));
    });


});
