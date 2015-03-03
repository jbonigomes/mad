$(document).on("pagecreate", function(){
	$(window).on("orientationchange", function(event){
		$("#status").text(event.orientation);
	});                     
});

