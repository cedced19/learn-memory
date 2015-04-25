angular.module('LearnMemory', ['hSweetAlert', 'ngSanitize', 'ngRoute', 'textAngular'])
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
.directive('toolbarTip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).toolbar(scope.$eval(attrs.toolbarTip));
        }
    };
})
.controller('LearnMemoryLessonCtrl', ['$scope', '$location', '$http', 'sweet', '$routeParams', function($scope, $location, $http, sweet, $routeParams) {
        $http.get('/api/'+ $routeParams.id).success(function(data) {
            $scope.currentItem = data;

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
                    $http.delete('/api/'+$scope.currentItem.id).success(function() {
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
                $http.put('/api/'+$scope.currentItem.id, $scope.currentItem).success(function() {
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
}])
.controller('LearnMemoryCreationCtrl', ['$scope', '$location', '$http', 'sweet', function($scope, $location, $http, sweet) {
        $scope.newItem = {
            content: ''
        };

        $scope.displayLesson = function() {
            $http.post('/api', $scope.newItem).success(function(data) {
                sweet.show('The lesson has been saved.', '', 'success');
                $location.path('/lesson/' + data.id.toString());
            }).error(function() {
                sweet.show('Oops...', 'Something went wrong!', 'error');
            });
        };
}])
.controller('LearnMemoryListCtrl', ['$scope', '$location', '$http', 'sweet', function($scope, $location, $http, sweet) {
        $http.get('/api').success(function(data) {
            $scope.items = data;
            $scope.short = true;

            $scope.goItem = function (item) {
                $location.path('/lesson/' + item.id);
            };

            $scope.advancedSearch = function () {
                $http.get('/api/long').success(function(data) {
                    $scope.items = data;
                    $scope.short = false;
                }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
            };
        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');
        });
}]);