module.exports = ['$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $rootScope, $cookieStore, sweet) {
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
}];
