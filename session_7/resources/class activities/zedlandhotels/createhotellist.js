$(document).on("pagecontainerbeforeshow", function (e, ui) {
	var page = ui.toPage[0].id;
	if( page == 'five' ) {
		$.get("data/hotels.json", function(result, status) {
		var hotel = "";
		for (var i = 0; i < result.length; i++) {
		hotel += 
		"<li><a href='hotel.html?id=" + 
		result[i].id + 
		"'>" + 
		result[i].name + 
		"</a></li>";
		}
		$("#hotellist").html(hotel).listview("refresh");
		}, "json");	
	}
});