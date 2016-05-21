module.exports = ['$scope', '$location', '$http', '$rootScope', 'notie', function($scope, $location, $http, $rootScope, notie) {
        $rootScope.nav = 'users';

        if (!$rootScope.user) {
          $location.path('/');
        }

        $http.get('/api/version').success(function (data) {
            if (data.update) {
                $scope.update = data.url;
            }
        });

        $http.get('/api/registrants').success(function (data) {
            $scope.registrants = data;

            $scope.addUser = function(user) {
                $scope.registrants.forEach(function (value, key) {
                   if (value.id == user.id) {
                       $http.post('/api/users', {
                            name: value.name,
                            password: value.password
                        }).success(function(data) {
                            delete $scope.registrants[key];
                            $scope.users.push(value);
                            notie.alert(1, 'The user has been added.', 3);
                            $http.delete('/api/registrants/' + user.id);
                            $scope.search = '';
                        }).error($rootScope.$error);
                   }
                });
            };

            $scope.deleteRegistrant = function (user) {
                $scope.registrants.forEach(function (value, key) {
                   if (value.id == user.id) {
                       $http.delete('/api/registrants/' + user.id).success(function(data) {
                            delete $scope.registrants[key];
                            notie.alert(1, 'The registrant has been deleted.', 3);
                            $scope.search = '';
                        }).error($rootScope.$error);
                   }
                });
            };
        }).error($rootScope.$error);

        $http.get('/api/users').success(function(data) {
            $scope.users = data;

            $scope.createUser = function () {
                $location.path('/users/new');
            };

            $scope.updateUser = function (user) {
                $location.path('/users/' + user.id);
            };

            $scope.deleteUser = function (user) {
                if (user.id == $scope.user.id) {
                    notie.alert(3, 'You can\'t delete yourself!', 3);
                } else {
                    notie.confirm('Delete this user?', 'Yes, delete it!', 'Cancel', function() {
                        $http.delete('/api/users/'+ user.id).success(function() {
                            $scope.users.forEach(function (value, key) {
                                if (value.id == user.id) {
                                     delete $scope.users[key];
                                }
                            });
                            $scope.search = '';
                            notie.alert(1, 'Deleted! The user has been deleted.', 3);
                        }).error($rootScope.$error);
                    });
                }
            };
        }).error($rootScope.$error);
}];
