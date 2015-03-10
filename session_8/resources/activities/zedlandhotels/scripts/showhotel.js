$(document).on("pagecontainerbeforeshow", function (e, ui) {
	var page = ui.toPage[0].id;
    if(page === 'hotelpage') {
	var thisPage = "#" + page;
	var thisUrl = $(location).attr('search'); 
	var thisId = thisUrl.split("=")[1];
		$.get("data/hotel" + thisId +".json", function(result, status) {
			$("#hoteltitle",thisPage).text(result.name);	
			$("#hotelid", thisPage).html(thisId);
			var hotel = 
			"<p>" + 
			result.stars + 
			"</p><p>" + 
			result.description + 
			"</p>" + 
			"<img src='images/" + 
			result.image + 
			"' alt='hotel' class='hotel'>";
			$("#contentArea", thisPage).html(hotel);
		}, "json");
	}
});
