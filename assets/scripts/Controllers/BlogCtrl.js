app.controller('BlogCtrl', ['$scope', '$http', '$sce', '$location', '$window', function ($scope, $http, $sce, $location, $window) {
    $scope.blog = {};

    $scope.search = function(query) {
        $window.location.href = '/Search?query=' + query;
    };

    $scope.init = function () {
        // Get the blog parameter
        var name = $location.search().name;

        $http.get('/api/blogs?name=' + name)
            .success(function (blog) {
                $scope.blog = blog;
                $scope.blog['htmlBody'] = $sce.trustAsHtml(blog.content);

                $scope.identifier = blog.title;
                $scope.url = 'http://localhost:60664/#!/Blogs/' + blog.title;
                $scope.contentLoaded = true;
            }).error(function () {
                $window.location.href = '/';
            });
    };

    $scope.init();
}]);