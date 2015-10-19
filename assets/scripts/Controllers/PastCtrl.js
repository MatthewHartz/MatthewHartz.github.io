app.controller('PastCtrl', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.blogs = {};

    $scope.goToBlog = function (name) {
        window.location = '/blogs?name=' + name;
    }

    $scope.search = function () {
        $window.location.href = '/Search?query=' + $scope.searchText;
    }

    $scope.init = function () {
        $http.get('/api/blogs/archive')
            .success(function (blogs) {
                $scope.archive = blogs;
            }).error(function () {
                var test = '';
            });
    };

    $scope.init();
}]);