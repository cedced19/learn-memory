module.exports = ['$scope', '$location', '$http', '$routeParams', '$rootScope', 'notie', '$translate', 'Upload', function($scope, $location, $http, $routeParams, $rootScope, notie, $translate, Upload) {

        $http.get('/api/'+ $routeParams.id).success(function(data) {
            $scope.currentLesson = data;

            $scope.editing = false;

            $scope.removeLesson = function() {
                $rootScope.$login(function () {
                  $translate(['delete_it', 'delete_lesson_question', 'lesson_deleted', 'cancel']).then(function (translations) {
                    notie.confirm(translations['delete_lesson_question'], translations['delete_it'], translations['cancel'], function() {
                        $http.delete('/api/' + $scope.currentLesson.id).success(function() {
                            notie.alert(1, translations['lesson_deleted'], 3);
                            $location.path('/');
                        }).error($rootScope.$error);
                    });
                  });
                });
            };

            $scope.addAttachment = function () {
              $rootScope.$login(function () {
                $scope.uploading = true;
                Upload.upload({
                    url: '/api/attachments/',
                    disableProgress: true,
                    data: {
                      file: $scope.file,
                      lesson_id: $routeParams.id
                    }
                }).then(function (res) {
                  $translate('attachment_saved').then(function (translation) {
                    notie.alert(1, translation, 3);
                    $scope.file = false;
                    $scope.uploading = false;
                    if (typeof $scope.currentLesson.attachments == "undefined") $scope.currentLesson.attachments = [];
                    $scope.currentLesson.attachments.push(res.data.filename)
                  });
                }, function () {
                  $scope.uploading = false;
                  $translate('error_upload').then(function (translation) {
                    notie.alert(3, translation, 3);
                  });
                });
              });
            };

            $scope.removeAttachment = function(attachment) {
                $rootScope.$login(function () {
                  $translate(['delete_it', 'delete_attachment_question', 'attachment_deleted', 'cancel']).then(function (translations) {
                    notie.confirm(translations['delete_attachment_question'], translations['delete_it'], translations['cancel'], function() {
                        $http.delete('/api/attachments/' + $scope.currentLesson.id + '/' + attachment).success(function() {
                            $scope.currentLesson.attachments.splice($scope.currentLesson.attachments.indexOf(attachment), 1);
                            notie.alert(1, translations['attachment_deleted'], 3);
                        }).error($rootScope.$error);
                    });
                  });
                });
            };

            $scope.print = function() {
                window.print();
            };

            $scope.displayLesson = function() {
                $rootScope.$login(function () {
                  $http.put('/api/' + $scope.currentLesson.id, $scope.currentLesson).success(function(data) {
                      $scope.currentLesson.updatedAt = data.updatedAt;
                      $scope.editing = false;
                      $translate('lesson_saved').then(function (translation) {
                        notie.alert(1, translation, 3);
                      });
                  }).error($rootScope.$error);
                });
            };
        }).error(function() {
            $translate('lesson_doesnt_exist').then(function (translation) {
              notie.alert(2, translation, 3);
            });
            $location.path('/');
        });
}];
