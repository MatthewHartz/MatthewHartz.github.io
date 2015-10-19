app.controller('AboutCtrl', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
    $scope.identifier = "About Matthew Hartz";
    $scope.url = 'http://localhost:60664/About';
    $scope.contentLoaded = true;
}]);