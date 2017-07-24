require('angular'); /*global angular*/
require('angular-route');
require('angular-sanitize');
require('angular-touch');
require('ng-notie');
require('./edit/text-angular-rangy.min.js');
require('./edit/text-angular-sanitize.min.js');
require('./edit/text-angular.min.js');
require('ng-infinite-scroll');
require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-translate-loader-url');
require('angular-local-storage');
require('ng-file-upload');

var app = angular.module('LearnMemory', ['ngNotie', 'ngSanitize', 'ngRoute', 'ngTouch', 'textAngular', 'LocalStorageModule', 'pascalprecht.translate', 'ngFileUpload', 'infinite-scroll']);
app.config(['$routeProvider', '$translateProvider', 'localStorageServiceProvider',  function($routeProvider, $translateProvider, localStorageServiceProvider) {
        // Route configuration
        $routeProvider
        .when('/', {
            templateUrl: '/views/lessons-list.html',
            controller: 'LearnMemoryLessonsListCtrl'
        })
        .when('/lessons/new', {
            templateUrl: '/views/lessons-new.html',
            controller: 'LearnMemoryLessonsNewCtrl'
        })
        .when('/lessons/:id', {
            templateUrl: '/views/lessons-id.html',
            controller: 'LearnMemoryLessonsIdCtrl'
        })
        .when('/users', {
            templateUrl: '/views/users-list.html',
            controller: 'LearnMemoryUsersListCtrl'
        })
        .when('/users/new', {
            templateUrl: '/views/users-new.html',
            controller: 'LearnMemoryUsersNewCtrl'
        })
        .when('/users/:id', {
            templateUrl: '/views/users-id.html',
            controller: 'LearnMemoryUsersIdCtrl'
        })
        .when('/signup', {
            templateUrl: '/views/signup.html',
            controller: 'LearnMemorySignupCtrl'
        })
        .when('/login', {
            templateUrl: '/views/login.html',
            controller: 'LearnMemoryLoginCtrl'
        })
        .when('/languages', {
            templateUrl: '/views/languages.html',
            controller: 'LearnMemoryLanguagesCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });

        // Localstorage configuration
        localStorageServiceProvider.setPrefix('learn-memory');

        // i18n configuration
        $translateProvider
        .useStaticFilesLoader({
            prefix: '/langs/locale-',
            suffix: '.json'
        })
        .registerAvailableLanguageKeys(['en', 'fr'], {
          'fr_*': 'fr',
          'en_*': 'en',
          '*': 'en'
        })
        .useSanitizeValueStrategy(null)
        .determinePreferredLanguage()
        .fallbackLanguage('en');

        // service worker configuration
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/sw.js', { scope: '/' });
        }
}]);
app.run(['$rootScope', '$location', '$http', 'notie', '$translate', 'localStorageService', function ($rootScope, $location, $http, notie, $translate, localStorageService) {
        $rootScope.$menu = {
            show: function () {
              document.getElementsByTagName('body')[0].classList.add('with-sidebar');
            },
            hide: function (path) {
              document.getElementsByTagName('body')[0].classList.remove('with-sidebar');
              if (path) {
                $location.path(path);
              }
            },
            logout: function () {
              $http.get('/logout').success(function () {
                $rootScope.user = false;
                $location.path('/');
              });
            }
        };

        $rootScope.$on('$routeChangeSuccess', function(event, next, current) { // Close menu
          $rootScope.nav = $location.path();
        });

        $http.get('/authenticated').success(function (data) {
          if (data.status) {
              $rootScope.user = data.user;
          } else {
              $rootScope.user = false;
          }
        });

        $rootScope.$error = function () { // Send message error
          $http.get('/authenticated').success(function (data) {
            if (!data.status) {
                $rootScope.user = false;
            }
            $translate('error_occured').then(function (error) {
              notie.alert(3, error , 3);
            });

          }).error(function () {
            $translate('http_error').then(function (error) {
              notie.alert(3, error, 3);
            });
          });
        };

        $rootScope.$login = function (cb) { // Login before error
          $http.get('/authenticated').success(function (data) {
            if (!data.status) {

              $translate(['authenticate_title', 'login', 'continue', 'cancel', 'name', 'password', 'invalid_auth']).then(function (translations) {

                notie.input(translations['authenticate_title'], translations['continue'], translations['cancel'], 'text', translations['name'], function (name) {
                  notie.input(translations['authenticate_title'], translations['login'], translations['cancel'], 'password', translations['password'], function (password) {
                    $http.post('/login', {
                        name: name,
                        password: password
                    }).success(function(data) {
                        $rootScope.user = data;
                        cb();
                    }).error(function () {
                        notie.alert(3, translations['invalid_auth'], 3);
                    });
                  });
                });

              });
            } else {
              cb();
            }
          });
      };

        var lang = localStorageService.get('lang');
        if (lang) {
          $translate.use(lang);
        }
}]);
app.directive('toolbarTip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).toolbar(scope.$eval(attrs.toolbarTip));
        }
    };
});
app.controller('LearnMemoryLessonsListCtrl', require('./controllers/lessons-list.js'));
app.controller('LearnMemoryLessonsIdCtrl', require('./controllers/lessons-id.js'));
app.controller('LearnMemoryLessonsNewCtrl', require('./controllers/lessons-new.js'));
app.controller('LearnMemoryUsersListCtrl', require('./controllers/users-list.js'));
app.controller('LearnMemoryUsersIdCtrl', require('./controllers/users-id.js'));
app.controller('LearnMemoryUsersNewCtrl', require('./controllers/users-new.js'));
app.controller('LearnMemorySignupCtrl', require('./controllers/signup.js'));
app.controller('LearnMemoryLoginCtrl', require('./controllers/login.js'));
app.controller('LearnMemoryLanguagesCtrl', require('./controllers/languages.js'));
