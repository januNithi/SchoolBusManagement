
describe('Main Controller', function () {
    /*jshint expr:true */
    beforeEach(module('myApp'));

    var $controller,busRegistrationService,studentRegistrationService;
    var $q;
    var deferred;

    beforeEach(inject(function(_$controller_,_$rootScope_,_studentRegistrationService_,_$q_,_tripRegistrationService_,$httpBackend) {
        $q = _$q_;
        $scope = _$rootScope_.$new();
        deferred = _$q_.defer();
        $controller = _$controller_;
        studentRegistrationService=_studentRegistrationService_;
        tripRegistrationService=_tripRegistrationService_;
        $controller('studentRegistrationController', {
            $scope: $scope
        });
        spyOn(studentRegistrationService, 'getStudentData').and.returnValue(deferred.promise);
        spyOn(studentRegistrationService, 'postStudentData').and.returnValue(deferred.promise);
        spyOn(studentRegistrationService, 'deleteStudentData').and.returnValue(deferred.promise);

        $httpBackend.when("POST","/get/studentData").respond("sample");
        $httpBackend.when("POST","/post/studentData").respond("sample");
        $httpBackend.when("POST","/delete/studentData").respond("sample");
    }));

    describe('main Controller', function () {
        it('check getTripRegDetails', function () {
            var $scope = {};
            var controller = $controller('studentRegistrationController', {$scope: $scope});
            $scope.getTripRegDetails();
            expect().not.toBeNull();
        });

        it('check getStudentRegData', function () {
            var $scope = {};
            var controller = $controller('studentRegistrationController', {$scope: $scope});
            $scope.getStudentRegData();
            expect().not.toBeNull();
        });


        it('Add StudentRegData', function () {
            var $scope = {};
            var data={
                Name:'Raj',
                Gender:'Male',
                MobileNo:'9043814022',
                tripId:'1'
            };
            var controller = $controller('studentRegistrationController', { $scope: $scope });

            $scope.save(data);
            expect().not.toBeNull();
        });

        it('delete StudentRegData', function () {
            var $scope = {};
            var data={
                data:7
            };
            var controller = $controller('studentRegistrationController', { $scope: $scope });

            $scope.delete(data);
            expect().not.toBeNull();
        });

        it('Edit StudentRegData', function () {
            var $scope = {};
            var data={
                Name:'Raj',
                Gender:'Male',
                MobileNo:'9043814022',
                tripId:1
            };
            var controller = $controller('studentRegistrationController', { $scope: $scope });
            $scope.Edit(data);
            expect().not.toBeNull();
        });
        it('close modal', function () {
            var $scope = {};
            var controller = $controller('studentRegistrationController', { $scope: $scope });
            $scope.close();
            expect().not.toBeNull();
        });

        it('select menu', function () {
            var $scope = {};
            var data={

                value :'bus'

            };
            var controller = $controller('studentRegistrationController', { $scope: $scope });
            $scope.showSelectable(data);
            expect().not.toBeNull();
        });
    });
});

