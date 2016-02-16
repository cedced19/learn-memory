module.exports = ['$scope', '$location', '$http', '$rootScope', 'notie', function($scope, $location, $http, $rootScope, notie) {
        $rootScope.nav = 'login';

        if ($rootScope.user) {
            $location.path('/');
        }

        $scope.login = function () {
            $http.post('/login', {
                name: $scope.name,
                password: $scope.password
            }).success(function(data) {
                $rootScope.user = data;
                $location.path('/');
            }).error($rootScope.$error);
        };
}];
