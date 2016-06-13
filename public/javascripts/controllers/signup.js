module.exports = ['$scope', '$location', '$http', '$rootScope', 'notie', '$translate', function($scope, $location, $http, $rootScope, notie, $translate) {
        $rootScope.nav = '';

        if ($rootScope.user) {
            $location.path('/');
        }

        $scope.signup = function () {
            $http.post('/api/registrants', {
                name: $scope.name,
                password: $scope.password
            }).success(function() {
                $location.path('/');
                $translate('registrant_created').then(function (translation) {
                 notie.alert(1, translation, 3);
               });
            }).error($rootScope.$error);
        };
}];
