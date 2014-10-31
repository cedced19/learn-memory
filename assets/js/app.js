angular.module("LearnMemory", [ "ngSanitize", "hc.marked" ])
.controller("LearnMemoryCtrl", function($scope, $location, $http, marked) {

        $http.get("/lesson").success(function(data, status, headers, config) {

        $scope.items = data;
        $scope.edit = false;
        $scope.currentItem = null;
        $scope.currentFolder = null;
        $scope.search = null;


        $scope.itemSelected = function (item) {
            $scope.currentItem = item;
            $scope.edit = false;
            $scope.folderSelected("item");
        }


        $scope.goItem = function (item) {
            $location.path("/" + item.id);
        }

        $scope.folderSelected = function(folder) {
            $scope.currentFolder = folder;
            $scope.waitConfirm = false;
            if (folder != "item"){
                $scope.currentItem = null;
                $scope.edit = false;
            }
        }

        $scope.newLesson = function() {
            $scope.folderSelected("creation");
            $scope.newItem = {
                content: "",
                markdown: ""
            };
        }

        $scope.displayPreview = function() {
            if($scope.edit==true){
                $scope.currentItem.content = marked($scope.currentItem.markdown);
            }else{
                $scope.newItem.content = marked($scope.newItem.markdown);
            }
        }


        $scope.displayLesson = function() {
            $scope.displayPreview();
            if($scope.edit==true){
                $http.put("/lesson/"+$scope.currentItem.id, $scope.currentItem).success(function(data, status, headers, config) {
                    $scope.items.forEach(function(item) {
                        if (item.id == data.id){
                            item = data;
                        }
                    });
                    $scope.edit = false;
                    }).error(function(data, status, headers, config) {
                    $location.path("");
                });
            }else{
                $http.post("/lesson", $scope.newItem).success(function(data, status, headers, config) {
                    $scope.items.push(data);
                    $location.path(data.id.toString());
                    }).error(function(data, status, headers, config) {
                    $location.path("");
                });
            }
        }

        $scope.removeLesson = function(remove) {
            $scope.waitConfirm = false;
            $scope.items.delete(remove);
            $http.delete('/lesson/'+remove.id);
            $location.path("");
        }

        $scope.removeHtml = function (string) {
            return string.replace(new RegExp("<.[^>]*>", "gi" ), "");
        }

        $scope.$watch(function() {
            return $location.path();
        }, function(newPath) {
            $scope.folderSelected("list");
            var tabPath = newPath.split("/");
            if (tabPath.length > 1 & tabPath[1] == "creation"){
                $scope.newLesson();
            }else{
               $scope.items.forEach(function(item) {
                    if (item.id == tabPath[1]){
                        $scope.itemSelected(item);
                    }
                });
            }
        });

        }).error(function(data, status, headers, config) {
            $scope.error = true;
        });
});

Array.prototype.delete = function(val){
        var index = this.indexOf(val);
        if(index > -1){
            this.splice(index,1)
        }
}