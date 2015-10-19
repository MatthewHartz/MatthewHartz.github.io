app.controller('HeaderCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.fixNavbar = function() {
        if (!$scope.atTop && $scope.atTop != null) {
            return "navibar-fixed";
        }
        return "";
    }
}]);