require('angular');
require('angular-route');
require('angular-sanitize');
require('angular-touch');
require('angular-cookies');
require('./alert/sweet-alert.js');
require('./alert/ng-sweet-alert.js');
require('./edit/text-angular-rangy.min.js');
require('./edit/text-angular-sanitize.min.js');
require('./edit/text-angular.min.js');

angular.module('LearnMemory', ['hSweetAlert', 'ngSanitize', 'ngRoute', 'ngTouch', 'ngCookies', 'textAngular'])
.config(['$routeProvider', function($routeProvider){
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
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'LearnMemoryLoginCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]).run(['$rootScope', '$location', function($rootScope, $location){
        $rootScope.$menu = {
            show: function () {
                     document.getElementsByTagName('body')[0].classList.add('with-sidebar');
            },
            hide: function (path) {
                    document.getElementsByTagName('body')[0].classList.remove('with-sidebar');
                    if (path) {
                        $location.path(path);
                    }
            }
        };
}]).directive('toolbarTip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).toolbar(scope.$eval(attrs.toolbarTip));
        }
    };
}).controller('LearnMemoryLessonsListCtrl', ['$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $rootScope, $cookieStore, sweet) {
        $rootScope.nav = 'lessons';

        $rootScope.user = $cookieStore.get('learn-memory-user');

        $http.get('/api').success(function(data) {
            $scope.lessons = data;
            $scope.short = true;

            $scope.goLesson = function (lesson) {
                $location.path('/lessons/' + lesson.id);
            };

            $scope.advancedSearch = function () {
                $http.get('/api/long').success(function(data) {
                    $scope.lessons = data;
                    $scope.short = false;
                }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
            };
        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');
        });
}]).controller('LearnMemoryLessonsIdCtrl', ['$scope', '$location', '$http', '$routeParams', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $routeParams, $rootScope,  $cookieStore, sweet) {
        $rootScope.nav = '';

        $rootScope.user = $cookieStore.get('learn-memory-user');

        $http.get('/api/'+ $routeParams.id).success(function(data) {
            $scope.currrentLesson = data;

            $scope.editing = false;

            $scope.removeLesson = function() {
                sweet.show({
                    title: 'Confirm',
                    text: 'Delete this lesson?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Yes, delete it!',
                    closeOnConfirm: false
                }, function() {
                    $http.delete('/api/'+$scope.currrentLesson.id).success(function() {
                        sweet.show('Deleted!', 'The lesson has been deleted.', 'success');
                        $location.path('/');
                    }).error(function() {
                        sweet.show('Oops...', 'Something went wrong!', 'error');
                    });
                });
            };

            $scope.print = function() {
                window.print();
            };

            $scope.displayLesson = function() {
                $http.put('/api/'+$scope.currrentLesson.id, $scope.currrentLesson).success(function(data) {
                    $scope.currrentLesson.updatedAt = data.updatedAt;
                    $scope.editing = false;
                    sweet.show('The lesson has been saved.', '', 'success');
                }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
            };
        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');
            $location.path('/');
        });
}]).controller('LearnMemoryLessonsNewCtrl', ['$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $rootScope, $cookieStore, sweet) {
        $rootScope.nav = 'creation';

        $rootScope.user = $cookieStore.get('learn-memory-user');

        $scope.newLesson = {
            content: ''
        };

        $scope.displayLesson = function() {
            $http.post('/api', $scope.newLesson).success(function(data) {
                sweet.show('The lesson has been saved.', '', 'success');
                $location.path('/lessons/' + data.id.toString());
            }).error(function() {
                sweet.show('Oops...', 'Something went wrong!', 'error');
            });
        };
}]).controller('LearnMemoryUsersListCtrl', ['$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $rootScope, $cookieStore, sweet) {
        $rootScope.nav = 'users';

        $rootScope.user = $cookieStore.get('learn-memory-user');

        $http.get('/api/users').success(function(data) {
            $scope.users = data;

            $scope.createUser = function () {
                $location.path('/users/new');
            };

            $scope.updateUser = function (user) {
                $location.path('/users/' +user.id);
            };

            $scope.deleteUser = function (user) {
                if (user.id == $scope.user.id) {
                    sweet.show('Oops...', 'You can\'t delete yourself!', 'error');
                } else {
                    sweet.show({
                        title: 'Confirm',
                        text: 'Delete this user?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Yes, delete it!',
                        closeOnConfirm: false
                    }, function() {
                        $http.delete('/api/users/'+user.id).success(function() {
                            sweet.show('Deleted!', 'The lesson has been deleted.', 'success');
                            $location.path('/');
                        }).error(function() {
                            sweet.show('Oops...', 'Something went wrong!', 'error');
                        });
                    });
                }
            };
        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');
        });
}]).controller('LearnMemoryUsersIdCtrl', ['$routeParams', '$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($routeParams, $scope, $location, $http, $rootScope, $cookieStore, sweet) {
        $rootScope.nav = '';

        $rootScope.user = $cookieStore.get('learn-memory-user');

        if ($rootScope.user.id  == $routeParams.id) {
            $scope.name = $rootScope.user.name;
        } else {
            $http.get('/api/users/' + $routeParams.id).success(function(data) {
                $scope.name = data.name;
            }).error(function() {
                sweet.show('Oops...', 'Something went wrong!', 'error');
            });
        }

        $scope.updateUser = function () {
                $http.put('/api/users/' + $routeParams.id, {
                    name: $scope.name,
                    password: $scope.password
                }).success(function(data) {
                    sweet.show('The user has been updated.', '', 'success');
                    $location.path('/users/' + data.id.toString());
                }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
        };
}]).controller('LearnMemoryUsersNewCtrl', ['$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $rootScope, $cookieStore, sweet) {
        $rootScope.nav = '';

        $rootScope.user = $cookieStore.get('learn-memory-user');

        $scope.createUser = function() {
            $http.post('/api/users', {
                name: $scope.name,
                password: $scope.password
            }).success(function(data) {
                sweet.show('The user has been saved.', '', 'success');
                $location.path('/users/' + data.id.toString());
            }).error(function() {
                sweet.show('Oops...', 'Something went wrong!', 'error');
            });
        };
}]).controller('LearnMemoryLoginCtrl', ['$scope', '$location', '$http', '$rootScope', 'sweet', function($scope, $location, $http, $rootScope, sweet) {
        $rootScope.nav = 'login';

        $scope.login = function () {
            $http.post('/login', {
                name: $scope.name,
                password: $scope.password
            }).success(function(data) {
                $rootScope.user = data;
                $location.path('/')
            }).error(function() {
                sweet.show('Oops...', 'Something went wrong!', 'error');
            });
        };
}]);
