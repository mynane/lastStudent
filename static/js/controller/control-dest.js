define(function() {
    calendarApp.controller("controlDest", function($scope, $http, $utils, $location) {
    	var searchParams = $location.search();
    	var type = searchParams.type;
    	if(type == 1){
    		$scope.manageDestRightView='admin-content';
    	}else if(type == 2){
    		$scope.manageDestRightView='admin-content';
    	}else if(type == 3){
    		$scope.manageDestRightView='user-manage';
    	}else if(type == 4){
    		$scope.manageDestRightView='system-log';
    	}else if(type==5){
    		$scope.manageDestRightView='help-page';
    	}
    });

});