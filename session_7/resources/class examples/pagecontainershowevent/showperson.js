$(document).on("pagecontainerbeforeshow", function (event ) {
	var thisPage = $.mobile.pageContainer.pagecontainer('getActivePage').attr('id');
    if( thisPage === 'personpage') {
	var thisUrl = $(location).attr('search'); 
	var thisId = thisUrl.split("=")[1];
	$.get("person" + thisId + ".json", function(result, status) {
		var person = 
		"<p>Name: " + 
		result.name + 
		"</p><p>Description: " + 
		result.description + 
		"</p><p>Role: " + 
		result.role +
		"</p>";
		$("#contentArea", "#" + thisPage).html(person);
	    }, "json");
	}
});
