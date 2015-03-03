$(document).on("pagecontainerbeforeload pagecontainerload pagebeforecreate pagecreate pagecontainerbeforeshow pagecontainershow pagecontainerbeforehide pagecontainerhide", function(event) {
	console.log(event.type);
});

