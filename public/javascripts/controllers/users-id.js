module.exports = ['$routeParams', '$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($routeParams, $scope, $location, $http, $rootScope, $cookieStore, sweet) {
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
}];
