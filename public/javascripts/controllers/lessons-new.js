module.exports = ['$scope', '$location', '$http', '$rootScope', 'notie', '$translate', function($scope, $location, $http, $rootScope, notie, $translate) {

        if (!$rootScope.user) {
          $location.path('/');
        }

        $scope.newLesson = {
          content: ''
        };

        $scope.displayLesson = function() {
            $http.post('/api', $scope.newLesson).success(function(data) {
                $translate('lesson_saved').then(function (translation) {
                  notie.alert(1, translation, 3);
                });
                $location.path('/lessons/' + data.id.toString());
            }).error($rootScope.$error);
        };
}];
