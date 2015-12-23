module.exports = ['$scope', '$location', '$http', '$rootScope', 'sweet', function($scope, $location, $http, $rootScope, sweet) {
        $rootScope.nav = 'creation';

        $scope.newLesson = {};
        $scope.displayLesson = function() {
            $http.post('/api', $scope.newLesson).success(function(data) {
                sweet.show('The lesson has been saved.', '', 'success');
                $location.path('/lessons/' + data.id.toString());
            }).error(function() {
                sweet.show('Oops...', 'Something went wrong!', 'error');
            });
        };
}];
