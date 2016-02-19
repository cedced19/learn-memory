module.exports = ['$scope', '$location', '$http', '$rootScope', 'notie', function($scope, $location, $http, $rootScope, notie) {
        $rootScope.nav = 'creation';

        if (!$rootScope.user) {
          $location.path('/');
        }
        
        $scope.newLesson = {
          content: ''
        };

        $scope.displayLesson = function() {
            $http.post('/api', $scope.newLesson).success(function(data) {
                notie.alert(1, 'The lesson has been saved.', 3);
                $location.path('/lessons/' + data.id.toString());
            }).error($rootScope.$error);
        };
}];
