$(function() {
	// Used because if the user is at top position 100 (when bar becomes sticky)
	// they click to fire both events
	POSITION = 0;
	
	$("#navibar").on('affixed.bs.affix', function(){
        //alert("The navigation menu has been affixed. Now it doesn't scroll with the page.");
		var temp = $(window).scrollTop();
		if (temp != POSITION) {
			$("#stickyImage").show();
		}
		POSITION = temp
    });
	
	$("#navibar").on('affixed-top.bs.affix', function(){
        //alert("The navigation menu has been affixed. Now it doesn't scroll with the page.");
		var temp = $(window).scrollTop();
		if (temp != POSITION) {
			$("#stickyImage").hide();
		}
		POSITION = temp
    });
	
	/*
	*
	* Jquery stylings
	*
	*/
	$("#banner").css("min-height", function(){ 
		return $(this).height();
	});
	
	$("#header").css("height", function(){ 
		return $("#banner").height() - $("#navibar").height();
	});
	
	/*$("#title").css("height", function(){ 
		return $("#banner").height() - $("#navibar").height();
	});*/
	
	$("#navibar").attr("data-offset-top", function () {
		return $("#header").height();
	});
});