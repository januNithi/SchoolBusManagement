/**
 * Created by Administrator on 21.06.2016.
 */
/**
 * Created by Administrator on 6/1/2016.
 */

/**
 * Created by Administrator on 6/1/2016.
 */

describe('studentRegistrationService Services', function () {

    var $controller,$factory;
    beforeEach(module('myApp'));



    beforeEach(inject(function($injector){
        $factory=$injector.get("studentRegistrationService");
    }));

    describe('get getStudentData', function () {
        it('getStudentData function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/studentData')
                .respond(200);
            var res = $factory.getStudentData();
            expect($httpBackend.flush).not.toThrow();

        }));

        it('getStudentData function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/get/student')
                .respond(200);
            var res = $factory.getStudentData();
            expect($httpBackend.flush).toThrow();

        }));
    });

    describe('Add StudentData', function () {
        it('Add bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/post/studentData')
                .respond(200);

            var data={
                regNo:'13',
                busCode:'Bus1',
                gpsUnit:'2',
                unitName: 'GPS1'
            };
            var res = $factory.postStudentData(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('Add StudentData function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/post/student')
                .respond(200);
            var data={
                regNo:'13',
                Name:'Raj',
                Gender:'Male',
                MobileNo:'9043814022',
                tripId:1

            };
            var res = $factory.postStudentData(data);
            expect($httpBackend.flush).toThrow();

        }));
    });

    describe('Delete deleteStudentData', function () {
        it('Delete bus function', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/delete/studentData')
                .respond(200);

            var data={
                data:7
            };
            var res = $factory.deleteStudentData(data);
            expect($httpBackend.flush).not.toThrow();

        }));

        it('Delete deleteStudentData function invalid url', inject(function ($httpBackend) {

            $httpBackend
                .when('POST','/delete/student')
                .respond(200);
            var data={
                data:7
            };
            var res = $factory.deleteStudentData(data);
            expect($httpBackend.flush).toThrow();

        }));
    });


});
