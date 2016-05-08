define(["public/storage/storage"], function (storage) {
    /*这个controller就是用来存储一些全局变量，也就是只会背初始化一次，然后每次更改都会永久保存状态*/
    calendarApp.controller("BodyController", function ($scope, $http, $location) {
        $scope.bodyScope = $scope;
    });
});
