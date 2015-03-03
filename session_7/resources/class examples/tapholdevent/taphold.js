$(document).on("pagecreate", function() {
	$("body").bind("taphold", function (event) {
		$("#savepopup").popup("open");
	})
});

