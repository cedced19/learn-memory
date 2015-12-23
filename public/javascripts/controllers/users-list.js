module.exports = ['$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $rootScope, $cookieStore, sweet) {
        $rootScope.nav = 'users';

        $rootScope.user = $cookieStore.get('learn-memory-user');

        $http.get('/api/version').success(function (data) {
            if (require('semver').lt(data.local, data.github)) {
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
                            sweet.show('The user has been added.', '', 'success');
                            $http.delete('/api/registrants/' + user.id);
                            $scope.search = '';
                        }).error(function() {
                            sweet.show('Oops...', 'Something went wrong!', 'error');
                        });
                   }
                });
            };

            $scope.deleteRegistrant = function (user) {
                $scope.registrants.forEach(function (value, key) {
                   if (value.id == user.id) {
                       $http.delete('/api/registrants/' + user.id).success(function(data) {
                            delete $scope.registrants[key];
                            sweet.show('The registrant has been deleted.', '', 'success');
                            $scope.search = '';
                        }).error(function() {
                            sweet.show('Oops...', 'Something went wrong!', 'error');
                        });
                   }
                });
            };
        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');
        });

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
                    sweet.show('Oops...', 'You can\'t delete yourself!', 'error');
                } else {
                    sweet.show({
                        title: 'Confirm',
                        text: 'Delete this user?',
                        type: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#DD6B55',
                        confirmButtonText: 'Yes, delete it!',
                        closeOnConfirm: false
                    }, function() {
                        $http.delete('/api/users/'+ user.id).success(function() {
                            $scope.users.forEach(function (value, key) {
                                if (value.id == user.id) {
                                     delete $scope.users[key];
                                }
                            });
                            $scope.search = '';
                            sweet.show('Deleted!', 'The user has been deleted.', 'success');
                        }).error(function() {
                            sweet.show('Oops...', 'Something went wrong!', 'error');
                        });
                    });
                }
            };
        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');
        });
}];
