angular.module('LearnMemory', [ 'ngSanitize', 'ngRoute', 'hc.marked' ])
.config(['$routeProvider', function($routeProvider){
    $routeProvider
     .when('/lesson/:id', {
      templateUrl: 'vendor/views/lesson.html',
      controller: 'LearnMemoryLessonCtrl'
    })
     .when('/', {
      templateUrl: 'vendor/views/list.html',
      controller: 'LearnMemoryListCtrl'
    })
     .when('/error', {
      templateUrl: 'vendor/views/error.html'
    })
    .when('/creation', {
      templateUrl: 'vendor/views/creation.html',
      controller: 'LearnMemoryCreationCtrl'
    })
    .otherwise({
        redirectTo: '/'
      });
}])
.controller('LearnMemoryLessonCtrl', ['$scope', '$location', '$routeParams', '$http', 'marked', function($scope, $location, $routeParams, $http, marked) {
        $http.get('/api/'+ $routeParams.id).success(function(data) {
                        $scope.currentItem = data;

                        $scope.editing = false;

                         $scope.displayPreview = function() {
                                   $scope.currentItem.content = marked($scope.currentItem.markdown);
                         };

                        $scope.removeLesson = function() {
                                    $http.delete('/api/'+$scope.currentItem.id);
                                    $location.path('/');
                        };

                        $scope.print = function() {
                                    window.print();
                        };


                        $scope.displayLesson = function() {
                                $scope.displayPreview();
                                $http.put('/api/'+$scope.currentItem.id, $scope.currentItem).success(function(data, status, headers, config) {
                                            $scope.editing = false;
                                }).error(function() {
                                            $location.path('/');
                                });
                 };
         }).error(function() {
                    $location.path('/error');
        });
}])
.controller('LearnMemoryCreationCtrl', ['$scope', '$http', 'marked', '$location', function($scope, $http, marked, $location) {
        $scope.newItem = {
                content: '',
                markdown: ''
        };

        $scope.displayPreview = function() {
                $scope.newItem.content = marked($scope.newItem.markdown);
        };

        $scope.displayLesson = function() {
                $scope.displayPreview();
                $http.post('/api', $scope.newItem).success(function(data) {
                    $location.path('/lesson/' + data.id.toString());
                    }).error(function() {
                    $location.path('/error');
                });
        };
}])
.controller('LearnMemoryListCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {

        $http.get('/api').success(function(data) {
        $scope.items = data;

        $scope.goItem = function (item) {
            $location.path('/lesson/' + item.id);
        };

        }).error(function() {
            $location.path('/error');
        });
}]);