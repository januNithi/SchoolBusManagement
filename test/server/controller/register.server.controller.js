/**
 * Created by Administrator on 5/30/2016ss.
 */

var expect = require('chai').expect;
var controllerToTest = require('../../../controller/register.server.controller.js');
var docService=require('../../../config/db/registerManager');
var supertest = require('supertest');
var sinon = require('sinon');
var error = new Error('some error occured');
var server;
//------------------- Bus Registratioin--------------------//

describe('Registration Server Controller', function() {


    before(function () {
        server = require('../../../server').server;
        this.timeout(40000);

    });

    describe('delete BusReg', function() {
    it('returns the result', function(done) {
        var req = {
            body:{
                data:1
            }
        };
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.deleteRegDetails(req,res); // call the function to be tested
    });
});

    describe('Add BusReg', function() {
        it('returns the result', function(done) {
            var req = {
                body:{
                    regNo:'13',
                    busCode:'Bus1',
                    gpsUnit:'2',
                    unitName: 'GPS1'
                }
            };
            this.timeout(600);
            setTimeout(done, 500);

            // we provide the response object which the controller uses
            var res = {
                end: function() {
                    expect();
                    done();
                }
            };
            controllerToTest.addRegDetails(req,res); // call the function to be tested
        });
    });

    
    describe('get BusReg', function() {
        it('returns the result', function(done) {
            var req=null;
            this.timeout(500);
            setTimeout(done, 300);
    
            // we provide the response object which the controller uses
            var res = {
                end: function() {
                    expect();
                    done();
                }
            };
            controllerToTest.busRegDetails(req,res); // call the function to be tested
        });
    });


    describe('Update BusReg', function() {
        it('returns the result', function(done) {
            var req={
                body:{

                    id: 65,
                    regNo: '08',
                    busCode: 'Bus3',
                    gpsUnit: 2,
                    unitName: 'GPS3'
                }
             
                
                
            };
            this.timeout(500);
            setTimeout(done, 300);

            // we provide the response object which the controller uses
            var res = {
                end: function() {
                    expect();
                    done();
                }
            };
            controllerToTest.addRegDetails(req,res); // call the function to be tested
        });
    });


//------------------- Bus Registratioin--------------------//


//------------------ GPSUNIT REGISTRAION-------------------//

    describe('get unitReg', function() {
        it('returns the result', function(done) {
            var req =null;
            this.timeout(500);
            setTimeout(done, 300);

            // we provide the response object which the controller uses
            var res = {
                end: function() {
                    expect();
                    done();
                }
            };
            controllerToTest.gpsUnitRegDetails(req,res); // call the function to be tested
        });
    });

    describe('post unitReg', function() {
        it('returns the result', function(done) {
            var req ={

                body:{

                     unitName: 'Gps2', uniqueid: 7

                }


            };
            this.timeout(500);
            setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.postGpsRegDetails(req,res); // call the function to be tested
    });
});

describe('updete unitReg', function() {
    it('returns the result', function(done) {
        var req ={

            body:{

                id: 9, unitName: 'Gps1', uniqueid: 8

            }

        };
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.updateGpsRegDetails(req,res); // call the function to be tested
    });
});


describe('delete unitReg', function() {
    it('returns the result', function(done) {
        var req ={

            body:{
                data: 9
            }
        };
        this.timeout(500);
        setTimeout(done, 300);
        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.deleteGpsRegDetails(req,res); // call the function to be tested
    });
});


//------------------ GPSUNIT REGISTRAION-------------------//

//------------------ TRIP REGISTRAION-------------------//


describe('get TripReg', function() {
    it('returns the result', function(done) {
        var req =null;
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.getTripRegData(req,res); // call the function to be tested
    });
});


describe('update TripReg', function() {
    it('returns the result', function(done) {
        var req ={
            
            body:{
                id: 27,
                trpName: 'gps',
                trpSession: 'EVENING',
                trpStart: '00:00:05',
                trpEnd: '00:00:01',
                rtId: 1,
                busId: 1,
                drvId: 1
            }
            
            
        };
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.postTripRegDetail(req,res); // call the function to be tested
    });
});


describe('post TripReg', function() {
    it('returns the result', function(done) {
        var req ={

            body:{

                trpName: 'EVENINIG',
                trpSession: '2.00',
                trpStart: '00:00:05',
                trpEnd: '00:00:01',
                rtId: 1,
                busId: 1,
                drvId: 1

            }



        };
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.postTripRegDetail(req,res); // call the function to be tested
    });
});


describe('delete TripReg', function() {
    it('returns the result', function(done) {
        var req = {

            body: {

                data: 27

            }

        };
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.deleteTripRegDetail(req,res); // call the function to be tested
    });
});



//------------------TRIP REGISTRAION-------------------//

//------------------STUDENT REGISTRAION-------------------//

describe('get studentReg', function() {
    it('returns the result', function(done) {
        var req =null;
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.getStudentDetails(req,res); // call the function to be tested
    });
});

describe('post studentReg', function() {
    it('returns the result', function(done) {
        var req =
        {
            body:{

                Name:'Raj',
                Gender:'Male',
                MobileNo:'9043814022',
                tripId:'1'

            }

        };
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.postStudentData(req,res); // call the function to be tested
    });
});


describe('post studentReg', function() {
    it('returns the result', function(done) {
        var req =
        {
            body:{
                id:1,
                Name:'Raj',
                Gender:'Male',
                MobileNo:'9043814022',
                tripId:1

            }

        };
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.postStudentData(req,res); // call the function to be tested
    });
});


describe('delete studentReg', function() {
    it('returns the result', function(done) {
        var req =
        {
            body:{


                data:7
            }



        };
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.deleteStudentData(req,res); // call the function to be tested
    });
});

//------------------STUDENT REGISTRAION-------------------//

//------------------DRIVER REGISTRAION-------------------//
describe('get DriverReg', function() {
    it('returns the result', function(done) {
        var req =null;
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.getDriverDetails(req,res); // call the function to be tested
    });
});

describe('delete DriverReg', function() {
    it('returns the result', function(done) {
        var req =
        {
            body:{

                data:3
            }

        };
        this.timeout(500);
        setTimeout(done, 300);

        // we provide the response object which the controller uses
        var res = {
            end: function() {
                expect();
                done();
            }
        };
        controllerToTest.deleteDriverDetails(req,res); // call the function to be tested
    });
});

//
describe('upload DriverReg', function () {


    it('#upload', function (done) {

        this.timeout(500);
        setTimeout(done, 300);
        supertest(server).post('/post/DriverDetail')
            .field('driverName','jacki')
            .field('driverLicence', 'DriverLicense6546.jpeg')
            .field('mobNo', '9043215690')
            .field('driverPhoto', 'DriverPhoto9202.jpeg')
            .field('id', 'undefined')


            .end(function(err, res) {

                done();
            })
            .send(function(err, res) {

                done();
            });
            });

    });


    describe('update DriverReg', function () {

        server = require('../../../server').server;
        it('#upload', function (done) {

            this.timeout(500);
            setTimeout(done, 300);
            supertest(server).post('/post/DriverDetail')
                .field('id',2)
                .field('driverName','jacki')
                .attach('driverLicence', __dirname+'/../../../public/uploads/driverLicense/sample.png')
                .field('mobNo', '9043215690')
                .attach('driverPhoto',  __dirname+'/../../../public/uploads/driverPhoto/sample.png')


                .end(function(err, res) {

                    done();
                });

        });


    });


});


//------------------DRIVER REGISTRAION-------------------//
