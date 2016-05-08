define(function() {
    calendarApp.controller("adminLogin", function($scope, $http, $utils, $location) {
        var bodyScope = $scope.bodyScope;
        var parentController = $scope.modalScope;
        $scope.adminLogin=function(event){
            $location.url("/controlDest").search({'type':1}); //.search({})
            // $location.url("/systemLog");
        }
    });

});