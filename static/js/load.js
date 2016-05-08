require(['angular/angular.min'], function () {
    window.calendarApp = angular.module('calendar', ['ngRoute']);
   // 处理angular兼容性的，可以忽略
     //组件的全局变量
    window.globalModule = {};
    require(['angular/angular.route', //路由服务
        'tpl/all', //加载所有模板
        'route/admin-route',
        'i18n/i18n', //引入国际化
        'utils/utils', //引入模板指令
        'public/common/jingoal-tools', //工具类
        'directive/com-modal', //弹框指令
        'directive/img-err', //弹框指令
        'public/alert-tip/alert-tip', //提醒组件
        'public/paging/paging', //分页组件
        'public/mgtfile/mgtfile', //引入模板指令
        'directive/ng-template', //引入模板指令
        'controller/body-controller', //全局controller
        'controller/header-nav', //header controller
        'controller/admin-login', //admin login controller
        'controller/admin-sidebar', //admin login controller
        'controller/control-dest', //admin login controller
        'controller/admin-content', //admin login controller
        'controller/create-editor-dialog', //事件编辑 controller
        'filter/date-format' //自定义过滤
    ], function () {
        //处理angular兼容性的，可以忽略
        calendarApp.factory('http_response', function ($q) {
            var timer;
            return {
                'request': function (config) {
                    if(config.url.indexOf("/module") == -1) {
                        return config;
                    }
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        utils.ayncLoading(true);
                    },200);
                    //去除空格
                    if (typeof config.params != "undefined") {
                        for (var i in config.params) {
                            if(utils.get_obj_type(config.params[i])=="string"){
                                config.params[i] = utils.trim(config.params[i]);
                            }
                        }
                    }
                    if(config.url.indexOf("/module")>-1){
                        config.url = config.url.indexOf("?") == -1 ? config.url + "?version=" + new Date() * 1 : config.url + "&version=" + new Date() * 1;
                    }
                    return config;
                },
                'responseError': function () {
                    clearTimeout(timer);
                    utils.ayncLoading(false);
                    alertTip.show({
                         type: "error",
                         title: "网络异常，请稍后重试"
                    });
                },
                'response': function (response) {
                    if(response.config.url.indexOf("/module") == -1) {
                        return response;
                    }
                    if(response.config.url.indexOf("/module")>-1 
                        && typeof response.data =="string" 
                        && response.config.url.indexOf("/module/attach") == -1){
                        parent.postMessage('relogin=true', '*');
                    }
                    clearTimeout(timer);
                    utils.ayncLoading(false);
                    if ((typeof response.data.meta != "undefined") && response.data.meta.code != 200) {
                        var str=response.data.meta.message?response.data.meta.message:'数据加载出错，请刷新页面';
                        //处理台历被删除的情况
                        if(!((response.config.url.indexOf("/module/calendar/v1/event/eventList.do") > -1
                            ||response.config.url.indexOf("/module/calendar/v1/event/eventymdList.do") > -1)
                            && response.data.meta.code== 500
                            )){
                            alertTip.show({
                                type: "error",
                                title: str
                            });
                        }
                        return $q.reject(response);
                    } else {
                        return response;
                    }
                }
            };
        });
        calendarApp.config(function ($sceProvider, $locationProvider, $httpProvider, $compileProvider) {
            $httpProvider.interceptors.push('http_response');
            //angular会对a标签href属性的变量进行过滤，对这几个开头的添加信任
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tel|javascript|mailto|sms):/);
            $locationProvider.html5Mode(false);
            $sceProvider.enabled(false);
        });
        var calendarInjecter = angular.bootstrap(document, ['calendar']);
        calendarApp.run(function(){
            document.body.style.display="block";
        });
    });
});