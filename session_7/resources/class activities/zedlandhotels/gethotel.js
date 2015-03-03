$(document).on("pagecontainerbeforeshow", function (e, ui) {
	var page = ui.toPage[0].id;
	if( page == 'myhotels' ) {
		if (typeof(Storage) != "undefined") {
			displayHotelDetails(getHotelDetails());
		} else {
			$("#nostorage").text("The browser does not support storage");  
		}
	}
});

function getHotelDetails() {
	var hotelDetails = JSON.parse(localStorage.getItem('hotels'));
	return hotelDetails;
}

function displayHotelDetails(details) {
	var hotellink="<a href=hotel.html?id=" + details.hotelid + " class='ui-btn ui-corner-all ui-icon-arrow-r ui-btn-icon-right'>" + details.hoteltitle + "</a>";
	$("#hotel").html(hotellink);
}  


