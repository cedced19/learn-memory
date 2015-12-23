module.exports = ['$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $rootScope, $cookieStore, sweet) {
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
}];
