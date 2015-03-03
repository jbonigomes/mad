$(document).on("pagecreate", function(event) {
	$("body").bind("swipeleft swiperight", function (event) {
		var page = $.mobile.pageContainer.pagecontainer('getActivePage').attr('id');
		var dir = event.type;
		if (page === "swipepage1" && dir === "swipeleft") {
			$.mobile.pageContainer.pagecontainer("change", "#swipepage2");
		}
		if (page === "swipepage2" && dir === "swiperight"){
			$.mobile.pageContainer.pagecontainer("change", "#swipepage1");
		}
	})
});
