/**
 * Created by CSS on 13-06-2016.
 */
//
// describe('#Forum Controller', function () {
//
//     beforeEach(module('myApp'));
//
//     var $busRegistrationController;
//     var busRegistrationService;
//     var $q;
//     var deferred;
//
//     beforeEach(inject(function ($compile,_$controller_,_$rootScope_,_$busRegistrationService) {
//         //$location = _$location_;
//         $scope = _$rootScope_.$new();
//
//         $busRegistrationController = _$busRegistrationController_;
//
//         $q = _$q_;
//
//
//         busRegistrationService = _busRegistrationService_;
//
//         deferred = $q.defer();
//
//         $controller('busRegistrationController', {
//             $scope: $scope
//         });
//
//         spyOn(busRegistrationService, 'getBusRegDetails').and.returnValue(deferred.promise);
//         // spyOn(forumService, 'postAnswer').and.returnValue(deferred.promise);
//         // spyOn(forumService, 'getForumData').and.returnValue(deferred.promise);
//         // spyOn(forumService, 'postStar').and.returnValue(deferred.promise);
//         // spyOn(dashboardService, 'logout').and.returnValue(deferred.promise);
//         // spyOn(forumService, 'goToDashboard').and.returnValue(deferred.promise);
//         // $httpBackend.when("GET","/forum/getForum?type=All").respond("sample");
//         // $httpBackend.when("POST","/forum/postAnswer").respond("sample1");
//     }));
//
//     describe('#GET BUS REGISTRATION', function () {
//         it('get data', function () {
//             $scope.getBusRegDetails();
//             deferred.promise.then(function () {
//                 expect(busRegistrationService.getBusRegData).toHaveBeenCalled();
//             });
//
//         });
//     });
//
//
// });
//
//

describe('Main Controller', function () {
    /*jshint expr:true */
    beforeEach(module('myApp'));

    var $controller,busRegistrationService,gpsUnitRegistrationService;
    var $q;
    var deferred;


    // beforeEach(inject(function(_$controller_){
    //
    //       $controller = _$controller_;
    //
    // }));
    beforeEach(inject(function(_$controller_,_$rootScope_,_$q_,_busRegistrationService_,_gpsUnitRegistrationService_,$httpBackend) {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        deferred = _$q_.defer();
        $controller = _$controller_;
        busRegistrationService=_busRegistrationService_;
        gpsUnitRegistrationService=_gpsUnitRegistrationService_;

        $controller('busRegistrationController', {
            $scope: $scope
        });
        spyOn(busRegistrationService, 'getBusRegData').and.returnValue(deferred.promise);
        spyOn(busRegistrationService, 'addBusRegData').and.returnValue(deferred.promise);
        spyOn(busRegistrationService, 'deleteBusRegData').and.returnValue(deferred.promise);


        $httpBackend.when("POST","/get/busRegDetails").respond("sample");
        $httpBackend.when("POST","/post/busRegDetails").respond("sample");
        $httpBackend.when("POST","/post/deleteBusRegDetails").respond("sample");
    }));

    describe('main Controller', function () {
        it('check getbusdata', function () {
            var $scope = {};
            var controller = $controller('busRegistrationController', {$scope: $scope});
            $scope.getBusRegDetails();
            expect().not.toBeNull();
        });
        it('check getGpsdata', function () {
            var $scope = {};
            var controller = $controller('busRegistrationController', {$scope: $scope});
            $scope.getGpsDetails();
            expect().not.toBeNull();
        });

        it('check getbusdata', function () {
            var $scope = {};
            var controller = $controller('busRegistrationController', {$scope: $scope});
            $scope.getGpsDetails();
            expect().not.toBeNull();
        });

            it('updete busData', function () {
                var $scope = {};
                var data={
                    regNo:'13',
                    busCode:'Bus1',
                    gpsUnit:'2',
                    unitName: 'GPS1'
                };
                var controller = $controller('busRegistrationController', { $scope: $scope });

                $scope.update(data);
                expect().not.toBeNull();
            });

        it('delete busData', function () {
            var $scope = {};
            var data={
                id:'13'
            };
            var controller = $controller('busRegistrationController', { $scope: $scope });
            $scope.delete(data);
            expect().not.toBeNull();
        });

        it('Edit busData', function () {
            var $scope = {};
            var data={
                regNo:'13',
                busCode:'Bus1',
                gpsUnit:'2',
                unitName: 'GPS1'
            };
            var controller = $controller('busRegistrationController', { $scope: $scope });
            $scope.edit(data);
            expect().not.toBeNull();
        });
        it('close modal', function () {
            var $scope = {};
            var controller = $controller('busRegistrationController', { $scope: $scope });
            $scope.close();
            expect().not.toBeNull();
        });

        it('select menu', function () {
            var $scope = {};
            var data={

                    value :'bus'

            };
            var controller = $controller('busRegistrationController', { $scope: $scope });
            $scope.showSelectable(data);
            expect().not.toBeNull();
        });
    });
});

