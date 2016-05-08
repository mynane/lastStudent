define(['public/ckeditor/ckeditor'], function() {
    calendarApp.controller("createEditorDialog", function($scope, $http, $utils, $location) {
        var bodyScope = $scope.bodyScope;
        var parentController = $scope.modalScope;
        var path = $location.path();
        $scope.sendEditorContent = function(event) {
        	console.log(parentController.type);
            var userId = CookieUtil.getItem('uid');
            if (!$scope.inputTitle) {
                $scope.inputTitle = $scope.inputContent.substr(0, 12);
            }
            if ($scope.inputContent.length > 10) {
            	console.log(parentController.type);
            	if(parentController.type=="new"){
            		$http({
	                    method: "post",
	                    url: "../php/bin/addJoke.php",
	                    data: {
	                        userId: userId,
	                        title: $scope.inputTitle,
	                        content: $scope.inputContent
	                    },
	                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	                }).success(function(jsonData) {
	                    if (jsonData.meta.code == 200) {
	                        getList();
	                        $scope.closeModal();
	                    }
	                });
            	}else if(parentController.type=="editor"){
            		$http({
	                    method: "post",
	                    url: "../php/bin/editorJoke.php",
	                    data: {
	                        id:parentController.jokeId,
	                        title: $scope.inputTitle,
	                        content: $scope.inputContent
	                    },
	                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	                }).success(function(jsonData) {
	                    if (jsonData.meta.code == 200) {
	                        getList();
	                        $scope.closeModal();
	                    }
	                });
            	}
               

                function getList() {
                	var userId = CookieUtil.getItem('uid');
                    var data = {
                        page: 1,
                        table: 'joke',
                        size: 16,
                        queryWord: ""
                    }
                    data.queryWord="where up_userId = "+userId;
                    $http({
                        method: "post",
                        url: "../php/includes/page.class.php",
                        data: data,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    }).success(function(jsonData) {
                        if (jsonData.meta.code == 200) {
                            var jokeList = jsonData.data.list;
                            var allUser = $utils.getAllUser();
                            for (var i = 0; i < jokeList.length; i++) {
                                var name = allUser[jokeList[i].up_userId];
                                jokeList[i].fullName = name ? name : '停用人员';
                                jokeList[i].show = false;
                                var imgUrl = jokeList[i].imgage_url;
                                if (imgUrl) {
                                    jokeList[i].img_url = imgUrl.split(',');
                                }
                            }
                           	parentController.jokeList = jokeList;
                        	if(!$scope.$$phase){
                        		parentController.$digest();
                        	}
                        }
                    });
                }
            }
        }
    })
})
