app.controller('SearchCtrl', ['$scope', '$http', '$sce', '$location', '$window', function ($scope, $http, $sce, $location, $window) {
    $scope.results = {};

    $scope.goToBlog = function(name) {
        window.location = '/blogs?name=' + name;
    }

    $scope.init = function () {
        // Get the blog parameter
        var query = $location.search().query;

        $http({
            url: '/api/blogs/search',
            method: "GET",
            params: { query: query }
        }).success(function (results) {
            $scope.results = results;
        }).error(function () {
            $window.location.href = '/';
        });
    };

    $scope.init();
}]);