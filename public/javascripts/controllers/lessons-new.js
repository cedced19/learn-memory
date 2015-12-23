module.exports = ['$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $rootScope, $cookieStore, sweet) {
        $rootScope.nav = 'creation';

        $rootScope.user = $cookieStore.get('learn-memory-user');

        $scope.newLesson = {};
        $scope.displayLesson = function() {
            $http.post('/api', $scope.newLesson).success(function(data) {
                sweet.show('The lesson has been saved.', '', 'success');
                $location.path('/lessons/' + data.id.toString());
            }).error(function() {
                sweet.show('Oops...', 'Something went wrong!', 'error');
            });
        };
}];
