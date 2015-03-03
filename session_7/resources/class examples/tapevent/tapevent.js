$(document).on("pagecreate", function() {
	$("#tapme").bind("tap", function (event) {
		var myText = $("#confirm").text();
		if (myText.length === 0) {
			$("#confirm").text("Confirmation of tap event" )
		} else {
			$("#confirm").text("");
		}
	})
});

