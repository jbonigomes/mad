$(document).on("pagecreate", "#home", function () {
	$("#facebook").bind("tap", function () {
		$("#sharechannel").html("Facebook");
	});
	$("#twitter").bind("tap", function () {
		$("#sharechannel").html("Twitter");
	});
	$("#instagram").bind("tap", function () {
		$("#sharechannel").html("Instagram");
	});
});

