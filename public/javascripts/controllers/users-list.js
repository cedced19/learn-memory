module.exports = ['$scope', '$location', '$http', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $rootScope, $cookieStore, sweet) {
        $rootScope.nav = 'users';

        $rootScope.user = $cookieStore.get('learn-memory-user');

        $http.get('/api/users').success(function(data) {
            $scope.users = data;

            $scope.createUser = function () {
                $location.path('/users/new');
            };

            $scope.updateUser = function (user) {
                $location.path('/users/' +user.id);
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
                        $http.delete('/api/users/'+user.id).success(function() {
                            sweet.show('Deleted!', 'The lesson has been deleted.', 'success');
                            $location.path('/');
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
