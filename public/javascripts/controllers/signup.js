module.exports = ['$scope', '$location', '$http', '$rootScope', 'sweet', '$cookieStore', function($scope, $location, $http, $rootScope, sweet, $cookieStore) {
        $rootScope.nav = '';

        $rootScope.user = $cookieStore.get('learn-memory-user');
        if ($rootScope.user) {
            $location.path('/');
        }

        $scope.signup = function () {
            $http.post('/api/registrants', {
                name: $scope.name,
                password: $scope.password
            }).success(function() {
                $location.path('/');
                sweet.show('You have been registered.', '', 'success');
            }).error(function() {
                sweet.show('Oops...', 'Something went wrong!', 'error');
            });
        };
}];
