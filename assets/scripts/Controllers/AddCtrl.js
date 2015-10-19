app.controller('AddCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.title = '';
    $scope.content = '';
    $scope.tags = '';
    $scope.author = '';

    $scope.submitBlog = function() {
        var blog = {
            'title': $scope.title,
            'content': $scope.content,
            'tags': $scope.tags.split(' '),
            'author': 'Matthew Hartz',
            'createdOn': new Date()
        }

        $http.post('/api/blogs', blog)
            .success(function() {
                var test = '';
            }).error(function() {
                var test = '';
            });
    }
}]);