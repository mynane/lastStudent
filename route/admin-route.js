define(function (storage) {
    calendarApp.config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/',{
        	templateUrl: 'admin-login'
        }).when('/controlDest', {
        	templateUrl: 'control-dest',
        });
        // .otherwise({
        //     redirectTo : '/controlDest'
        // });,manageDestRightView
        	/**/
    });
});