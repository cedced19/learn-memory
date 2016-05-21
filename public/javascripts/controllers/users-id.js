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
           if ($scope.password == $scope.confirmpassword && $scope.password != $scope.oldpassword) {
             $http.put('/api/users/' + $routeParams.id, {
                 name: $scope.name,
                 password: $scope.password,
                 oldpassword: $scope.oldpassword
             }).success(function(data) {
                 notie.alert(1, 'The user has been updated.', 3);
                 $location.path('/users/');
             }).error(function (data, code) {
                 if (code == 401) {
                   notie.alert(3, 'Old password does not match.', 3);
                 } else {
                   $rootScope.$error();
                 }
             });
           } else {
             notie.alert(3, 'Password and confirm password are not the same.', 3);
           }
       };

}];
