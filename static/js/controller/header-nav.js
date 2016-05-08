define(function() {
    calendarApp.controller("headerNav", function($scope, $http, $utils, $location) {
        var bodyScope = $scope.bodyScope;
        var parentController = $scope.modalScope;
        $scope.itemNum = $location.path();
        $scope.userName = '';
        var login = '';
        var oldDefault=$location.path();
        var headerTitleList = document.getElementById('header-title-list');

        angular.element(document).ready(function(event) {
            var name = CookieUtil.getItem('name');
            if (name) {
                $scope.userName = name;
            }
        });
        /*angular.element(window).bind('reload',reload=function(){
            console.log(123);
           bodyScope.$broadcast('changeJokeList',  $scope.itemNum);
        })*/
        // bodyScope.$broadcast('changeJokeList',  $scope.itemNum);

        $scope.changeTitle = function(event, itemNum) {
            var userId = CookieUtil.getItem('uid');
            if(oldDefault!=itemNum){
                $scope.itemNum = itemNum;
                bodyScope.$broadcast('changeJokeList', itemNum);
                oldDefault=itemNum;
            }
        }
        $scope.$on('changeUserName', function(event, data) {
            $scope.userName = data;
        })
        $scope.login = function(event) {
            $utils.createModal('login-page', $scope, function(newEventModal, scope) {
                newEventModal.cmd("show");
            })
        }
        $scope.register = function(event) {
            $utils.createModal('register-page', $scope, function(newEventModal, scope) {
                newEventModal.cmd("show");
            })
        }
        $scope.outLogin = function(event) {
            $scope.userName = '';
            CookieUtil.removeItem('name');
            CookieUtil.removeItem('uid');
        }
    });
    calendarApp.controller("loginController", function($scope, $http, $utils) {
        var bodyScope = $scope.bodyScope;
        var parentController = $scope.modalScope;
        $scope.rememberMe = false;
        $scope.goRegiester = function(event) {
            $scope.loginPage = true;
            $utils.createModal('register-page', $scope, function(newEventModal, scope) {
                newEventModal.cmd("show");
            })
        }
        $scope.loginSubmit = function(event) {
            var loginName = $scope.loginUserName ? $scope.loginUserName : '';
            var password = $scope.loginUserPassWord ? $scope.loginUserPassWord : '';
            if (loginName.length > 6 && password.length > 6) {
                $http({
                    method: "post",
                    url: "../php/bin/login.php",
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: {
                        loginUserName: loginName,
                        loginUserPassWord: password
                    }
                }).success(function(jsonData) {
                    if (jsonData.meta.code == 200) {
                        var data = jsonData.data;
                        $scope.$emit('changeUserName', data.name);
                        if ($scope.rememberMe) {
                            CookieUtil.setItem('name', data.name, 604800);
                            CookieUtil.setItem('uid', data.id, 604800);
                        } else {
                            CookieUtil.setItem('name', data.name);
                            CookieUtil.setItem('uid', data.id);
                        }
                        $scope.closeModal();
                    }
                });
            } else if (loginName.length < 6 && password.length > 6) {
                var info = "请核对用户名";
                alertTip.show({
                    title: info,
                    type: 'warn-red'
                });
            }
        }
    });
    calendarApp.controller("registerController", function($scope, $http, $utils) {
        var bodyScope = $scope.bodyScope;
        var parentController = $scope.modalScope;
        $scope.registerSubmit = function(event) {
            $http({
                method: "post",
                url: "../php/bin/regiester.php",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: {
                    userName: $scope.userName,
                    userEmail: $scope.userEmail,
                    userPassWord: $scope.userPassWord
                }
            }).success(function(jsonData) {
                if (jsonData.meta.code == 200) {
                    console.log(jsonData);
                    var data = jsonData.data;
                    $scope.$emit('changeUserName', $scope.userName);
                    CookieUtil.setItem('name', $scope.userName);
                    CookieUtil.setItem('uid', jsonData.data.id);
                    $scope.closeModal();
                    try{
                        parentController.closeModal();
                    }catch(e){}
                }
            });
        }
    });
    calendarApp.controller("jokeBodyController", function($scope, $http, $utils,$location) {
        var bodyScope = $scope.bodyScope;
        var parentController = $scope.modalScope;
        $scope.commentIsClose = false;
        $scope.commentHide = true;
        $scope.jokeList=[];
        $current_id = $location.path();
        $scope.current_id = $current_id;
        $curent_page=1;
        getJokeList($current_id);
        var hasMore=true;
        $scope.$on('changeJokeList', function(event, id) {
            $curent_page=$current_id==id?$curent_page:1;
            $scope.jokeList=$current_id==id?$scope.jokeList:[];
            $current_id=id;
            $scope.current_id=id;
            hasMore=true;

            getJokeList(id);
        })
        $(window).on('scroll',function(event){
            if(hasMore){
                var mainHeight = $("#main_content").height();
                var windowScrollTop = $(window).scrollTop();
                var windowHeight = $(window).height();
                if(mainHeight+40 < (windowScrollTop + windowHeight)){
                    var method={};
                    clearTimeout(method.tId);
                    method.tId=setTimeout(function(){
                        getJokeList($current_id);
                    },3000);
                }
            }
        });
        function getJokeList(id) {
            var data = {
                    page:$curent_page,
                    table:'joke',
                    size:16,
                    queryWord:""
                }
            if(id =='/hotJoke'){
                data.queryWord="where allowed > 0 and love > 10";
            }else if(id =='/characterJoke'){
                data.queryWord = "where allowed > 0 and imgage_url IS NULL";
            }else if(id == "/imgJoke"){
                data.queryWord = "where allowed > 0 and imgage_url IS NOT NULL";
            }else if(id=="/myJoke"){
                var userId = CookieUtil.getItem('uid');
                data.queryWord="where up_userId = "+userId;
            }
            $http({
                method: "post",
                url: "../php/includes/page.class.php",
                data:data,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(jsonData) {
                if (jsonData.meta.code == 200) {
                    var jokeList = jsonData.data.list;
                    var allUser = $utils.getAllUser();
                    for (var i = 0; i < jokeList.length; i++) {
                        var name = allUser[jokeList[i].up_userId];
                        jokeList[i].fullName = name ? name : '停用人员';
                        jokeList[i].show = false;
                        var imgUrl=jokeList[i].imgage_url;
                        if(imgUrl){
                            jokeList[i].img_url= imgUrl.split(',');
                        }
                    }
                    $scope.jokeList=$scope.jokeList.concat(jokeList);
                    if($curent_page<jsonData.data.total){
                        $curent_page++;
                    }else{
                        $curent_page=jsonData.data.total;
                        hasMore=false;
                    }
                }
            });
        }
        $scope.showComment = function(event, item2) {
            var jokeList = $scope.jokeList;
            for (var i = 0; i < jokeList.length; i++) {
                if (jokeList[i].show && jokeList[i] != item2) {
                    $scope.jokeList[i].show = false;
                }
            }
            item2.show = !item2.show;
            if (item2.show) {
                $http({
                    method: "post",
                    url: "../php/bin/getComment.php",
                    data: {
                        joke_id: item2.id
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(jsonData) {
                    if (jsonData.meta.code == 200) {
                        var comment = jsonData.data;
                        var allUser = $utils.getAllUser();
                        for (var i = 0; i < comment.length; i++) {
                            var name = allUser[comment[i].coment_userId];
                            comment[i].fullName = name ? name : '停用人员';
                        }
                        $scope.commentList = jsonData.data;
                    }
                });
            }
        }
        $scope.changeCommentShow = function(event, commentHide) {
                $scope.commentHide = !$scope.commentHide;
            }

        $scope.setLove = function(item){
            console.log(item);
            $http({
                method: "post",
                url: "../php/bin/like.php",
                data: {
                    id:item.id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(jsonData) {
                if (jsonData.meta.code == 200) {
                   console.log(jsonData.data);
                }
            });
        }
            /**
             * 新建joke
             * @param  {event} event 事件对象
             * @return
             */
        $scope.createEditorDialog = function(event) {
            var userId = CookieUtil.getItem('uid');
            $scope.inputTitle = '';
            $scope.inputContent = '';
            $scope.type='new';
            if(!userId){
                $utils.createModal('login-page', $scope, function(newEventModal, scope) {
                    newEventModal.cmd("show");
                })
            }else{
                $utils.createModal('editor-dialog-box', $scope, function(newEventModal, scope) {
                    newEventModal.cmd("show");
                })
            }
        }
            //提交评论
        $scope.submitComment = function(event, item2, commentTextarea) {
            $scope.commentTextarea = '';
            var commentTextarea = commentTextarea;
            var userId = CookieUtil.getItem('uid');
            var CommentLength = $scope.commentList.length;
            if (commentTextarea.length > 0 && commentTextarea.length < 150) {
                $http({
                    method: "post",
                    url: "../php/bin/addComment.php",
                    data: {
                        addUserId: userId,
                        joke_id: item2.id,
                        content: commentTextarea,
                        CommentLength: CommentLength
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }).success(function(jsonData) {
                    if (jsonData.meta.code == 200) {
                        var comment = jsonData.data;
                        var allUser = $utils.getAllUser();
                        for (var i = 0; i < comment.length; i++) {
                            var name = allUser[comment[i].coment_userId];
                            comment[i].fullName = name ? name : '停用人员';
                        }
                        $scope.commentList = jsonData.data;
                        item2.comment++;
                    }
                });
            }
        }

        //删除joke
        $scope.deleteJoke= function(event,item,index){
            // console.log(item);
            // var info = "至少需要选中一项";
            // alertTip.show({
            //     title: info,
            //     type: 'warn-red'
            // });
            $http({
                method: "post",
                url: "../php/bin/deleteJoke.php",
                data: {
                    id:item.id
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(jsonData) {
                if (jsonData.meta.code == 200) {
                   $scope.jokeList.splice(index,1);
                }
            });
        }
        //编辑joke
        $scope.editorJoke=function(event,item){
            $scope.inputTitle=item.joke_title;
            $scope.inputContent=item.joke_content;
            $scope.jokeId=item.id;
            $scope.type='editor';
            $utils.createModal('editor-dialog-box', $scope, function(newEventModal, scope) {
                newEventModal.cmd("show");
            })
        }
    });

});
