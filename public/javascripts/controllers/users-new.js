module.exports = ['$scope', '$location', '$http', '$rootScope', 'notie', function($scope, $location, $http, $rootScope, notie) {
        $rootScope.nav = '';

        if (!$rootScope.user) {
          $location.path('/');
        }

        $scope.createUser = function() {
            $http.post('/api/users', {
                name: $scope.name,
                password: $scope.password
            }).success(function(data) {
                notie.alert(1, 'The user has been saved.', 3);
                $location.path('/users/' + data.id.toString());
            }).error($rootScope.$error);
        };
}];
