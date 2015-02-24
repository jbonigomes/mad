$(document).on("pagecreate", function() {
   $( "#addbtn" ).click(function() {
      if (typeof(Storage) != "undefined") {
	    setDetails(getTitle(), getUrl());
      } else {
        $("#nostorage").text("The browser does not support local storage");
      }
    });
});  

function getTitle() {
	var title = $("#hoteltitle").text();
	return title;
}

function getUrl() {
	var title = $("#hoteltitle").text();
	var url = title.replace(/\s+/g, '-').toLowerCase();
	return url;
}

function setDetails(title, url) {
	var hotel = {name: title, hotelurl: url};
	localStorage.setItem("hotels",JSON.stringify(hotel));
}
