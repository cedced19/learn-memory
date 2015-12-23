require('angular'); /*golbal angular*/
require('angular-route');
require('angular-sanitize');
require('angular-touch');
require('./alert/sweet-alert.js');
require('./alert/ng-sweet-alert.js');
require('./edit/text-angular-rangy.min.js');
require('./edit/text-angular-sanitize.min.js');
require('./edit/text-angular.min.js');

var app = angular.module('LearnMemory', ['hSweetAlert', 'ngSanitize', 'ngRoute', 'ngTouch', 'textAngular']);
app.config(['$routeProvider', function($routeProvider){
        $routeProvider
        .when('/', {
            templateUrl: '/views/lessons-list.html',
            controller: 'LearnMemoryLessonsListCtrl'
        })
        .when('/lessons/new', {
            templateUrl: '/views/lessons-new.html',
            controller: 'LearnMemoryLessonsNewCtrl'
        })
        .when('/lessons/:id', {
            templateUrl: '/views/lessons-id.html',
            controller: 'LearnMemoryLessonsIdCtrl'
        })
        .when('/users', {
            templateUrl: '/views/users-list.html',
            controller: 'LearnMemoryUsersListCtrl'
        })
        .when('/users/new', {
            templateUrl: '/views/users-new.html',
            controller: 'LearnMemoryUsersNewCtrl'
        })
        .when('/users/:id', {
            templateUrl: '/views/users-id.html',
            controller: 'LearnMemoryUsersIdCtrl'
        })
        .when('/signup', {
            templateUrl: '/views/signup.html',
            controller: 'LearnMemorySignupCtrl'
        })
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'LearnMemoryLoginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);
app.run(['$rootScope', '$location', '$http', function ($rootScope, $location, $http) {
        $rootScope.$menu = {
            show: function () {
              document.getElementsByTagName('body')[0].classList.add('with-sidebar');
            },
            hide: function (path) {
              document.getElementsByTagName('body')[0].classList.remove('with-sidebar');
              if (path) {
                $location.path(path);
              }
            },
            logout: function () {
              $http.get('/logout').success(function () {
                $rootScope.user = false;
                $location.path('/');
              });
            }
        };
        $http.get('/authenticated').success(function (data) {
          if (data.status) {
              $rootScope.user = data.user;
          } else {
              $rootScope.user = false;
          }
        });
}]);
app.directive('toolbarTip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).toolbar(scope.$eval(attrs.toolbarTip));
        }
    };
});
app.controller('LearnMemoryLessonsListCtrl', require('./controllers/lessons-list.js'));
app.controller('LearnMemoryLessonsIdCtrl', require('./controllers/lessons-id.js'));
app.controller('LearnMemoryLessonsNewCtrl', require('./controllers/lessons-new.js'));
app.controller('LearnMemoryUsersListCtrl', require('./controllers/users-list.js'));
app.controller('LearnMemoryUsersIdCtrl', require('./controllers/users-id.js'));
app.controller('LearnMemoryUsersNewCtrl', require('./controllers/users-new.js'));
app.controller('LearnMemorySignupCtrl', require('./controllers/signup.js'));
app.controller('LearnMemoryLoginCtrl', require('./controllers/login.js'));
