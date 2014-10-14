angular.module("LearnMemory", [ "ngSanitize", "hc.marked" ])
.controller("LearnMemoryCtrl", function($scope, $location, $http, marked) {

        $http.get("/save").success(function(data, status, headers, config) {

        $scope.items = data;
        $scope.currentItem = null;
        $scope.currentFolder = null;
        $scope.search = null;


        $scope.itemSelected = function (item) {
            $scope.currentItem = item;
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
            }
        }

        $scope.newLesson = function() {
            $scope.folderSelected("creation");
            $scope.newItem = {
                date: new Date(),
                content: ""
            }
        }

        $scope.displayPreview = function() {
            $scope.newItem.content = marked($scope.newItem.markdown);
        }

        $scope.displayLesson = function() {
            $scope.displayPreview();
            delete $scope.newItem.markdown;
            $scope.items.push($scope.newItem);
            $http.post("/new", $scope.items).success(function(data, status, headers, config) {
                $scope.items.unset($scope.newItem);
                $scope.items.push(data);
                $location.path(data.id);
                }).error(function(data, status, headers, config) {
                $location.path("");
            });
        }

        $scope.removeLesson = function(remove) {
            $scope.waitConfirm = false;
            $scope.items.unset(remove);
            $http.post('/set', $scope.items);
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

Array.prototype.unset = function(val){
        var index = this.indexOf(val);
        if(index > -1){
            this.splice(index,1)
        }
}