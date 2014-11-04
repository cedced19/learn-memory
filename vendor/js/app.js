angular.module("LearnMemory", [ "ngSanitize", "ngRoute", "hc.marked" ])
.config(function($routeProvider, $locationProvider) {
    $routeProvider
     .when('/lesson/:id', {
      templateUrl: 'vendor/views/lesson.html',
      controller: 'LearnMemoryLessonCtrl'
    })
     .when('/', {
      templateUrl: 'vendor/views/list.html',
      controller: 'LearnMemoryListCtrl'
    })
    .when('/creation', {
      templateUrl: 'vendor/views/creation.html',
      controller: 'LearnMemoryCreationCtrl'
    });
})
.controller("LearnMemoryLessonCtrl", function($scope, $location, $routeParams, $http, marked) {
        $http.get("/api/"+ $routeParams.id).success(function(data) {
                        $scope.currentItem = data;
                        $scope.edit = false;

                         $scope.displayPreview = function() {
                                   $scope.currentItem.content = marked($scope.currentItem.markdown);
                         }

                        $scope.removeLesson = function() {
                                    $scope.waitConfirm = false;
                                    $http.delete('/api/'+$scope.currentItem.id);
                                    $location.path("/");
                        }

                        $scope.displayLesson = function() {
                                $scope.displayPreview();
                                $http.put("/api/"+$scope.currentItem.id, $scope.currentItem).success(function(data, status, headers, config) {
                                            $scope.edit = false;
                                }).error(function(data, status, headers, config) {
                                            $location.path("/");
                                });
                 }
         }).error(function() {
                    $location.path("/");
        });
})
.controller("LearnMemoryCreationCtrl", function($scope, $http, marked, $location) {
        $scope.newItem = {
                content: "",
                markdown: ""
        };

        $scope.displayPreview = function() {
                $scope.newItem.content = marked($scope.newItem.markdown);
        }

        $scope.displayLesson = function() {
                $scope.displayPreview();
                $http.post("/api", $scope.newItem).success(function(data) {
                    $location.path('/lesson/' + data.id.toString());
                    }).error(function() {
                    $location.path("/");
                });
        }
})
.controller("LearnMemoryListCtrl", function($scope, $location, $http, marked) {

        $http.get("/api").success(function(data) {
        $scope.items = data;


        $scope.goItem = function (item) {
            $location.path("/lesson/" + item.id);
        }

        $scope.removeHtml = function (string) {
            return string.replace(new RegExp("<.[^>]*>", "gi" ), "");
        }



        }).error(function() {
            $scope.error = true;
        });
});