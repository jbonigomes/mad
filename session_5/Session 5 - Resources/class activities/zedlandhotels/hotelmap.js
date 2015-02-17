$(document).on("pagecontainershow", function (e, ui) {
  var page = ui.toPage[0].id;
	if( page == 'map-page' ) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initialize);
  } else {
        documentgetElementById("nogeolocation").innerHTML = "Geolocation is not supported by this browser.";
  }
 }
}); 

function initialize(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var currentPosition = new google.maps.LatLng(lat, lon);
  var churchillHotelPosition = new google.maps.LatLng(51.52307, -0.12426);

   var mapOptions = {
    zoom: 12,
    center: currentPosition,
	mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    },
  }
  
  var hotelMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  
  var currentPositionImage ='http://www.dcs.bbk.ac.uk/lo/mad/madexamples/session5/classactivities/zedlandhotels/icons/currentlocation.png';
  var userPosition  = new google.maps.Marker({
      position: currentPosition,
      map: hotelMap,
	  icon: currentPositionImage,
      title: 'You are here'
  });
  
  var churchillHotelMarkerImage = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|FF0000|000000';
  var churchillPosition = new google.maps.Marker({
      position: churchillHotelPosition,
      map: hotelMap,
	  icon: churchillHotelMarkerImage,
      title: 'Churchill Hotel'
  });
  
   var churchillHotelInfo ='<div id="mappopup">'+
      '<h4>Churchill Hotel</h4>'+
      '<p>Five Star Hotel in the middle of capital city</p>' +
      '</div>'; 
	  
  var churchillHotelInfoWindow = new google.maps.InfoWindow({
    content: churchillHotelInfo
  });
  
  google.maps.event.addListener(churchillPosition, 'click', function() {
    churchillHotelInfoWindow.open(hotelMap, churchillPosition);
  });
}

