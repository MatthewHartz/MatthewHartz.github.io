app.directive("scroll", ["$window", function ($window) {
    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
                if (this.pageYOffset >= 100) {
                    scope.atTop = false;
                } else {
                    scope.atTop = true;
                }
                scope.$apply();
            });
        }
    }
}]);