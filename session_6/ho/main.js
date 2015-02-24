$(document).on('pagecontainershow', function(e, ui) {

  var page = ui.toPage[0].id;
  
  if(page == 'map') {

    if(navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(initialize);
    }
  }
  else {
    $('#nogeolocation').innerHTML = "Geolocation is not supported by this browser.";
  }
});


function initialize(position) {

  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var currentPosition = new google.maps.LatLng(lat, lon);
  var churchillHotelPosition = new google.maps.LatLng(51.52307,-0.12426);

  var mapOptions = {
    zoom: 12,
    center: currentPosition,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
  };

  var hotelMap = new google.maps.Map(document.getElementById('map'), mapOptions);
  var currentPositionImage = 'http://www.dcs.bbk.ac.uk/lo/mad/madexamples/session5/classactivities/zedlandhotels/icons/currentlocation.png';

  var userPosition = new google.maps.Marker({
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

  var churchillHotelInfo =
    '<div id="mappopup">'+
      '<h4>Churchill Hotel</h4>'+
      '<p>Five Star Hotel in the middle of capital city</p>' +
      '<a href="churchill-hotel.html">Details</a>' +
    '</div>';

  var churchillHotelInfoWindow = new google.maps.InfoWindow({
    content: churchillHotelInfo
  });

  google.maps.event.addListener(churchillPosition, 'click', function() {
    churchillHotelInfoWindow.open(hotelMap, churchillPosition);
  });
}

$(document).on('pagecreate', function() {
  $('#addbtn').click(function() {
    if(typeof(Storage) != 'undefined') {
      setDetails(getTitle(), getUrl());
      $('#addedtofavourites').html('Succesfully added to favourites');
    } else {
      $('#nostorage').text('Local storage not supported');
    }
  });

  function getTitle() {
    var title = $('#hoteltitle').text();
    return title;
  }

  function getUrl() {
    var title = $('#hoteltitle').text();
    var url = title.replace(/\s+/g, '-').toLowerCase();
    return url;
  }

  function setDetails(title, url) {
    var hotel = {
      name: title,
      hotelurl: url
    };

    var storedHotels = JSON.parse(localStorage.getItem('hotels')) || [];

    storedHotels.push(hotel);

    localStorage.setItem('hotels', JSON.stringify(storedHotels));
  }
});


$(document).on('pagecontainerbeforeshow', function(e, ui) {
  var page = ui.toPage[0].id;
  
  if(page == 'myhotels') {
    if(typeof(Storage) != 'undefined') {
      displayHotelDetails(getHotelDetails());
    } else {
      $('#nostorage').text('Local storage not supported');
    }
  }

  function getHotelDetails() {
    var hotelDetails = JSON.parse(localStorage.getItem('hotels'));
    return hotelDetails;
  }

  function displayHotelDetails(details) {

    if(details !== null) {

      var hotel = '';

      details.forEach(function(detail) {
        hotel += '' +
          '<a href="' + detail.hotelurl + '.html"' +
          '   class="ui-btn ui-corner-all ui-icon-arrow-r ui-btn-icon-right">' +
              detail.name +
          '</a>';
      });

      $('#hotel').html(hotel);

    } else {
      $('#nostorage').html('You do not have any hotels in your list yet');
    }
  }
});
