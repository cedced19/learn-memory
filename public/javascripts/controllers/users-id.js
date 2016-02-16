module.exports = ['$routeParams', '$scope', '$location', '$http', '$rootScope', 'notie', function($routeParams, $scope, $location, $http, $rootScope, notie) {
        $rootScope.nav = '';

        if (!$rootScope.user) {
            $location.path('/');
        } else if ($rootScope.user.id  == $routeParams.id) {
            $scope.name = $rootScope.user.name;
        } else {
            $http.get('/api/users/' + $routeParams.id).success(function(data) {
                $scope.name = data.name;
            }).error($rootScope.$error);
        }

        $scope.updateUser = function () {
                $http.put('/api/users/' + $routeParams.id, {
                    name: $scope.name,
                    password: $scope.password
                }).success(function(data) {
                    notie.alert(1, 'The user has been updated.', 3);
                    $location.path('/users/' + data.id.toString());
                }).error($rootScope.$error);
        };
}];
