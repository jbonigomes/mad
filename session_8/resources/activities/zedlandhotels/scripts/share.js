$(document).on("pagecreate", "#home", function () {
	$("#facebook").bind("tap", function () {
		$("#sharechannel").html("Facebook");
	});
	$("#twitter").bind("tap", function () {
		$("#sharechannel").html("Twitter");
	});
	$("#linkedin").bind("tap", function () {
		$("#sharechannel").html("LinkedIn");
	});
});

