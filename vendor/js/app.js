angular.module('LearnMemory', ['hSweetAlert', 'ngSanitize', 'ngRoute', 'hc.marked' ])
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
    .when('/creation', {
      templateUrl: 'vendor/views/creation.html',
      controller: 'LearnMemoryCreationCtrl'
    })
    .otherwise({
        redirectTo: '/'
      });
}])
.controller('LearnMemoryLessonCtrl', ['$scope', '$location', '$routeParams', '$http', 'marked', 'sweet', function($scope, $location, $routeParams, $http, marked, sweet) {
        $http.get('/api/'+ $routeParams.id).success(function(data) {
                        $scope.currentItem = data;

                        $scope.editing = false;

                         $scope.displayPreview = function() {
                                   $scope.currentItem.content = marked($scope.currentItem.markdown);
                         };

                        $scope.removeLesson = function() {
                                    $http.delete('/api/'+$scope.currentItem.id).success(function() {
                                            sweet.show('Lesson deled', '', 'success');

                                    }).error(function() {
                                            sweet.show('Oops...', 'Something went wrong!', 'error');

                                    });
                                    $location.path('/');
                        };

                        $scope.print = function() {
                                    window.print();
                        };


                        $scope.displayLesson = function() {
                                $scope.displayPreview();
                                $http.put('/api/'+$scope.currentItem.id, $scope.currentItem).success(function() {
                                            $scope.editing = false;
                                            sweet.show('Changes saved', '', 'success');
                                }).error(function() {
                                            sweet.show('Oops...', 'Something went wrong!', 'error');
                                });
                 };
         }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');

        });
}])
.controller('LearnMemoryCreationCtrl', ['$scope', '$http', 'marked', '$location', 'sweet', function($scope, $http, marked, $location, sweet) {
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
                    sweet.show('Lesson saved', '', 'success');

                    $location.path('/lesson/' + data.id.toString());
                    }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');


                });
        };
}])
.controller('LearnMemoryListCtrl', ['$scope', '$location', '$http', 'sweet', function($scope, $location, $http, sweet) {

        $http.get('/api').success(function(data) {
        $scope.items = data;

        $scope.goItem = function (item) {
            $location.path('/lesson/' + item.id);
        };

        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');

        });
}]);