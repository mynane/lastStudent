define(function() {
    calendarApp.controller("adminContent", function($scope, $http, $utils, $location) {
        var bodyScope = $scope.bodyScope;
        var parentController = $scope.modalScope;
        getContentList();

        function getContentList(str){
        	var $curent_page=1;
        	var str = str ? str:'';
        	var size = 12;
        	 var data = {
                    page:$curent_page,
                    table:'joke',
                    size:size,
                    queryWord:str
                }
        	$http({
                method: "post",
                url: "../php/includes/page.class.php",
                data:data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(jsonData) {
                if (jsonData.meta.code == 200) {
                	console.log(jsonData);
                    var jokeList = jsonData.data.list;
                    var allUser = $utils.getAllUser();
                    for (var i = 0; i < jokeList.length; i++) {
                        var name = allUser[jokeList[i].up_userId];
                        jokeList[i].fullName = name ? name : '停用人员';
                    }
                    $scope.data=jsonData.data;
                    $scope.adminJokeList = jokeList;
                    pageWidget(jsonData.data.total,size,2)
                }
            });
        }

        $scope.isGetThrough=function(event,item,type,index){
        	$http({
                method: "post",
                url: "../php/bin/updateStatusjoke.php",
                data:{
                	id:item.id,
                	type:type
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(jsonData) {
                if (jsonData.meta.code == 200) {
                	$scope.adminJokeList.splice(index,1);
                	item.allowed = type;
                }
            });
        }
        $scope.selectDate=0;
        $scope.$watch('selectDate',function(n,o){
        	if(n==1){
        		getContentList('where allowed=0');
        	}else if(n==2){
        		getContentList('where allowed=1');
        	}else if(n==3){
        		getContentList('where allowed=2');
        	}
        })
        // pageWidget(150,16,2);
        function pageWidget(total,onePage,current){
            var eventCommentPage = $("#jokeList");
            console.log(eventCommentPage);
            eventCommentPage.html('');
            eventCommentPage.jingoalPaging({
                allpages:total,
                pageshow:onePage,
                current:current,
                maxShowPage:5
            },function(page){
                $scope.currentPage=page;
                // 从服务器中拉取数据
                // getCommentPage($scope, $http, $utils);
            });
        }
    });

});