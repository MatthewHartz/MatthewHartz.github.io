var app = angular.module('engineerBlog', [
    'ngRoute',
    'textAngular',
    'angularUtils.directives.dirDisqus',
    //'highlightFilter'
]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/Home',
            controller: 'HomeCtrl',
            caseInsensitiveMatch: true
        })
        .otherwise({
            controller: function () {
                window.location.replace('/');
            },
            template: "<div></div>"
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });
}]);

app.run(['$http', function ($http) {
    // asp.net uses this header to identify ajax requests
    $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}]);