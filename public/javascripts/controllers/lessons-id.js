module.exports = ['$scope', '$location', '$http', '$routeParams', '$rootScope', '$cookieStore', 'sweet', function($scope, $location, $http, $routeParams, $rootScope,  $cookieStore, sweet) {
        $rootScope.nav = '';

        $rootScope.user = $cookieStore.get('learn-memory-user');

        $http.get('/api/'+ $routeParams.id).success(function(data) {
            $scope.currrentLesson = data;

            $scope.editing = false;

            $scope.removeLesson = function() {
                sweet.show({
                    title: 'Confirm',
                    text: 'Delete this lesson?',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: 'Yes, delete it!',
                    closeOnConfirm: false
                }, function() {
                    $http.delete('/api/'+$scope.currrentLesson.id).success(function() {
                        sweet.show('Deleted!', 'The lesson has been deleted.', 'success');
                        $location.path('/');
                    }).error(function() {
                        sweet.show('Oops...', 'Something went wrong!', 'error');
                    });
                });
            };

            $scope.print = function() {
                window.print();
            };

            $scope.displayLesson = function() {
                $http.put('/api/'+$scope.currrentLesson.id, $scope.currrentLesson).success(function(data) {
                    $scope.currrentLesson.updatedAt = data.updatedAt;
                    $scope.editing = false;
                    sweet.show('The lesson has been saved.', '', 'success');
                }).error(function() {
                    sweet.show('Oops...', 'Something went wrong!', 'error');
                });
            };
        }).error(function() {
            sweet.show('Oops...', 'Something went wrong!', 'error');
            $location.path('/');
        });
}];