
describe('Controller', function () {
    /*jshint expr:true */
    beforeEach(module('myApp'));

    var $controller,gpsUnitRegistrationService;
    var $q;
    var deferred;


    // beforeEach(inject(function(_$controller_){
    //
    //       $controller = _$controller_;
    //
    // }));
    beforeEach(inject(function(_$controller_,_$rootScope_,_$q_,_gpsUnitRegistrationService_,$httpBackend) {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        deferred = _$q_.defer();
        $controller = _$controller_;
        gpsUnitRegistrationService=_gpsUnitRegistrationService_;

        $controller('gpsUnitRegistrationController', {
            $scope: $scope
        });
        spyOn(gpsUnitRegistrationService, 'getGpsUnitData').and.returnValue(deferred.promise);
        spyOn(gpsUnitRegistrationService, 'postGpsUnitData').and.returnValue(deferred.promise);
        spyOn(gpsUnitRegistrationService, 'deleteGpsUnitData').and.returnValue(deferred.promise);
        spyOn(gpsUnitRegistrationService, 'updateGpsUnitData').and.returnValue(deferred.promise);



        $httpBackend.when("POST","/get/gpsUnitData").respond("sample");
        $httpBackend.when("POST","/post/gpsUnitData").respond("sample");
        $httpBackend.when("POST","/post/deleteGpsUnitData").respond("sample");
        $httpBackend.when("POST","/post/updateGpsUnitData").respond("sample");

    }));

    describe('main Controller', function () {
        it('check getGpsUnit', function () {
            var $scope = {};
            var controller = $controller('gpsUnitRegistrationController', {$scope: $scope});
            $scope.getGpsUnitDetail();
            expect().not.toBeNull();
        });

        it('updete getGpsUnit', function () {
            var $scope = {};
            var  data={

                id: 9, unitName: 'Gps1', uniqueid: 8

            };
            var controller = $controller('gpsUnitRegistrationController', { $scope: $scope });

            $scope.Update(data);
            expect().not.toBeNull();
        });

        it('Add getGpsUnit', function () {
            var $scope = {};
            var data={
                unitName: 'Gps2', uniqueid: 7

            };
            var controller = $controller('gpsUnitRegistrationController', { $scope: $scope });

            $scope.add(data);
            expect().not.toBeNull();
        });

        it('delete getGpsUnit', function () {
            var $scope = {};
            var data={
                id:'13'
            };
            var controller = $controller('gpsUnitRegistrationController', { $scope: $scope });
            $scope.delete(data);
            expect().not.toBeNull();
        });

        it('Edit getGpsUnit', function () {
            var $scope = {};
            var data={
                unitName: 'Gps2', uniqueid: 7

            };
            var controller = $controller('gpsUnitRegistrationController', { $scope: $scope });
            $scope.edit(data);
            expect().not.toBeNull();
        });
        it('close modal', function () {
            var $scope = {};
            var controller = $controller('gpsUnitRegistrationController', { $scope: $scope });
            $scope.close();
            expect().not.toBeNull();
        });

        it('select menu', function () {
            var $scope = {};
            var data={value :'bus'

            };
            var controller = $controller('gpsUnitRegistrationController', { $scope: $scope });
            $scope.showSelectable(data);
            expect().not.toBeNull();
        });
    });
});

