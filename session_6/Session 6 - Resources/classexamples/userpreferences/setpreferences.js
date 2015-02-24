$(document).on("pagecreate", "#setpreferences", function() {
	if (typeof(Storage) != "undefined") {
		$('#prefForm').submit(function(e) {
			e.preventDefault(); 
			setPrefs();
			$(':mobile-pagecontainer').pagecontainer('change', 'getpreferences.html', {
			transition: 'slidefade'
			});
		});
	} else {
	$("#nostorage").text("The browser does not support local storage");  
	}
});

function setPrefs() {
	var color = $("input[name=radiobtncol]:checked").val();
	var text = $("input[name=radiobtntxt]:checked").val();
	localStorage.setItem('colorPref', color);
	localStorage.setItem('textPref', text);
	//Code to apply the preferences using jQuery and CSS
}



