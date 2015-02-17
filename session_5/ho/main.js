$(document).on('pagecontainershow', function(e, ui) {
  
  var page = ui.toPage[0].id;
  
  if(page == 'map') {
    if(navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(initialize);
    }
  }
  else {
    $('#nogeolocation')
      .innerHTML = "Geolocation is not supported by this browser.";
  }
});


function initialize(position) {

  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var currentPosition = new google.maps.LatLng(lat, lon);

  var mapOptions = {
      zoom: 12,
      center: currentPosition,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
      }
    };

  var hotelMap = new google.maps.Map($('#map-canvas'), mapOptions);
}
