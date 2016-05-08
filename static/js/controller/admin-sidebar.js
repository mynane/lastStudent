define(function() {
    calendarApp.controller("adminSidebar", function($scope, $http, $utils, $location) {
        $scope.adminLogin=function(event){
            console.log($location.$$hash='controlDest');
            $location.url("/controlDest"); //.search({})
        }
    });

});