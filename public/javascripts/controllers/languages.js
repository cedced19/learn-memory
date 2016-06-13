module.exports = ['$scope', '$rootScope', '$location', '$translate', 'notie', 'localStorageService', function ($scope, $rootScope, $location, $translate, notie, localStorageService) {

        $scope.languages = [
          {code: 'en', name: 'English'},
          {code: 'fr', name: 'Français'}
        ];

        $scope.changeLanguage = function (code) {
          $translate.use(code);
          $translate.refresh();
          localStorageService.set('lang', code);
        };

}];
