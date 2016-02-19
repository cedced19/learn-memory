module.exports = ['$scope', '$location', '$http', '$routeParams', '$rootScope', 'notie', function($scope, $location, $http, $routeParams, $rootScope, notie) {
        $rootScope.nav = '';

        $http.get('/api/'+ $routeParams.id).success(function(data) {
            $scope.currentLesson = data;

            $scope.editing = false;

            $scope.removeLesson = function() {
                $rootScope.$login(function () {
                  notie.confirm('Delete this lesson?', 'Yes, delete it!', 'Cancel', function() {
                      $http.delete('/api/'+$scope.currentLesson.id).success(function() {
                          notie.alert(1, 'Deleted! The lesson has been deleted.', 3);
                          $location.path('/');
                      }).error($rootScope.$error);
                  });
                });
            };

            $scope.print = function() {
                window.print();
            };

            $scope.displayLesson = function() {
                $rootScope.$login(function () {
                  $http.put('/api/'+$scope.currentLesson.id, $scope.currentLesson).success(function(data) {
                      $scope.currentLesson.updatedAt = data.updatedAt;
                      $scope.editing = false;
                      notie.alert(1, 'The lesson has been saved.', 3);
                  }).error($rootScope.$error);
                });
            };
        }).error(function() {
            notie.alert(2, 'The lesson does not exists anymore.', 3);
            $location.path('/');
        });
}];
