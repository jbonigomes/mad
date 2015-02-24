$(document).on("pagecontainerbeforeshow", function (e, ui) {
	var page = $.mobile.pageContainer.pagecontainer('getActivePage').attr( 'id' );
	if(page === "getpreferences") {
		if (typeof(Storage) != "undefined") {
			var userPrefs = getPrefs();
			displayPrefs(getPrefs(userPrefs));
		} else {
			$("#nostorage").text("The browser does not support storage");  
		}
	}
});

function getPrefs() {
	var prefs = '';
	var noPrefs = '';
	var color = localStorage.getItem('colorPref');
	var text = localStorage.getItem('textPref');

	if(color && text) {
		prefs += "Colour = " + color + "<br>"; 
		prefs += "Text = " + text; 
		noPrefs = '';
		$("#nopreferences").html(noPrefs);
	}
	else {
		var noPrefs = "You currently have no preferences set";
		$("#nopreferences").html(noPrefs);
	}
		return prefs;
}

function displayPrefs(prefs) {
	$("#preferences").html(prefs); 
}
