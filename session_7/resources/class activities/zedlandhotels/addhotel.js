$(document).on("pagecreate", "#hotelpage", function() {
	$( "#addbtn" ).click(function() {
		if (typeof(Storage) != "undefined") {
			storeHotelDetails(getHotelId(), getHotelTitle());
		} else {
			$("#nostorage").text("The browser does not support local storage");
		}
	});
});  

function getHotelId() {
	var hotelId = $("#hotelid").text();
	return hotelId;
}

function getHotelTitle() {
	var hotelTitle = $("#hoteltitle").text();
	return hotelTitle;
}

function storeHotelDetails(id, title) {
	var hotel = {hotelid: id, hoteltitle: title};
	localStorage.setItem("hotels",JSON.stringify(hotel));
}

