

(function () {
    angular.module('myApp').directive('dateTimepicker',dateTimePicker);

        dateTimePicker.$inject = [
            
        ];

        var dateTimePicker = function() {
            var link;
            link = function(scope, element, attr, ngModel) {
                console.log(ngModel);
                element = $(element);
                element.datetimepicker({
                    format: 'YYYY-MM-DD HH:mm:ss',
                    defaultDate: ngModel.$viewValue
                });
                element.on('dp.change', function(event) {
                    scope.$apply(function() {
                        ngModel.$setViewValue(event.date._d);
                    });
                });
            };

            return {
                restrict: 'A',
                link: link,
                require: 'ngModel'
            };
        }
})();
