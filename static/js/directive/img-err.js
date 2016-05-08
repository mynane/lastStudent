define(function(){
    calendarApp.directive('imgErr',function(){
        return {
	    link: function(scope, element, attrs) {
	      element.bind('error', function() {
	        // if (attrs.src != attrs.errSrc) {
	        //   attrs.$set('src', attrs.errSrc);
	        // }
	        console.log($(element).parent().remove());
	        scope.$digest();
	      });
	    }
	  }
	});
});