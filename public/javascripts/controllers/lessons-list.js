module.exports = ['$scope', '$location', '$http', '$rootScope', function($scope, $location, $http, $rootScope) {

      $scope.pagination = 0;
      $scope.terminal = false;

      $scope.load = function () {
          if (!$scope.terminal) {
            $scope.loading = true;

            $scope.pagination++;

            $http.get('/api/?page=' + $scope.pagination).success(function(data) {
              if (data.length < 30) {
                $scope.terminal = true;
              }
              $scope.lessons = $scope.lessons || [];
              $scope.lessons.push.apply($scope.lessons, data);
            })
            .error($rootScope.$error)
            .finally(function() {
              $scope.loading = false;
            });
          }
      }

      $scope.short = true;

      $scope.goLesson = function (lesson) {
          $location.path('/lessons/' + lesson.id);
      }

      $scope.advancedSearch = function () {
          $http.get('/api?createdAt&content').success(function(data) {
              $scope.lessons = data;
              $scope.short = false;
              $scope.terminal = true;
          }).error($rootScope.$error);
      };
}];
