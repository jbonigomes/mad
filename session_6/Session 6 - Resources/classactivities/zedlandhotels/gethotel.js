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
	var hotel="<a href='" + 
	details.hotelurl + 
	".html' class='ui-btn ui-corner-all ui-icon-arrow-r ui-btn-icon-right'>"+ 
	details.name + "</a>";
	$("#hotel").html(hotel);
}  
