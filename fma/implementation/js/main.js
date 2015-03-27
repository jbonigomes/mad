
$(document).bind('mobileinit', function () {
  $.mobile.page.prototype.options.theme = 'd';
});

$(document).on('pagecontainerbeforeshow', function(e, ui) {

  var page = ui.toPage[0].id;
  
  if(page == 'login') {
    var elem = document.querySelector('.js-switch');
    var init = new Switchery(elem, { color: '#AADD00' });
  }

  if(page == 'map') {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(initialize);
    } else {
      $('#nogeolocation')
        .innerHTML = 'Geolocation is not supported by this browser.';
    }
  }

  if(page == 'accommodation') {
    $.get('data/accommodation.json', function(result, status) {
      var accommodation = "";
      
      for(var i = 0; i < result.length; i++) {
        accommodation += '' +
          '<li>' +
            '<a href="hotel.html?id=' + result[i].id + '" class="ui-alt-icon">' +
              '<img src="/img/locations/default/accommodation_' + result[i].id + '.jpg">' +
              '<h3>' + result[i].name + '</h3>' +
              '<p>' +
                result[i].stars + '<br/>' +
                result[i].description +
              '</p>' +
            '</a>' +
          '</li>';
      }

      $('#accommodationlist').html(accommodation).listview('refresh');

    }, 'json');
  }

  if(page == 'hotelpage') {
    var thisPage = "#" + page;
    var thisUrl = $(location).attr('search');
    var thisId = thisUrl.split("=")[1];

    $.get('data/hotel' + thisId +'.json', function(result, status) {
      $('#hoteltitle',thisPage).text(result.name);
      $('#hotelid', thisPage).html(thisId);
      var hotel = '<p>' + result.stars + '</p><p>' + result.description + '</p>';
      $('#contentArea', thisPage).html(hotel);

      // Add the favourites button
      var active = '';

      if(isFavourite()) {
        active = 'active';
      }

      var favouritesButton = '<a id="addbtn" href="#" class="ui-btn ui-icon-star ' +
        'ui-btn-icon-left ui-corner-all ' + active + '">Favourites</a>';

      $('.favourites').html(favouritesButton);

    }, 'json');
  }
  
  if(page === 'myhotels') {
    if(typeof(Storage) !== undefined) {
      displayHotelDetails(getHotelDetails());
    } else {
      $('#nostorage').text('Local storage not supported');
    }
  }

  // Catch login form submit
  $('#frm1').on('submit', function(e) {
    e.preventDefault();
    if($(this).valid()) {
      $.mobile.navigate('index.html');
    }
  });

  // Catch booking form submit
  $('#frm2').on('submit', function(e) {
    e.preventDefault();
    if($(this).valid()) {
      $.mobile.navigate('registered.html');
    }
  });

  // Catch lost password form submit
  $('#frm3').on('submit', function(e) {
    e.preventDefault();
    if($(this).valid()) {
      $.mobile.navigate('lostmessage.html');
    }
  });

  // Init form validation
  $('#frm1').validate();
  $('#frm2').validate();
  $('#frm3').validate();

  // Add to favourites action
  $('body').on('click', '#addbtn', function() {

    if(typeof(Storage) != 'undefined') {

      if($(this).hasClass('active')) {
        removeDetails(getTitle());
        $(this).removeClass('active');
      } else {
        setDetails(getTitle(), getUrl());
        $(this).addClass('active');
      }
    } else {
      $(this).addClass('ui-btn-hidden');
      $('#nostorage').text('Local storage not supported');
    }
  });

  function isFavourite() {
    var exists       = false;
    var url          = getUrl();
    var storedHotels = getHotelDetails() || [];

    storedHotels.forEach(function(hotel) {
      if(hotel.hotelurl == url) {
        exists = true;
      }
    });

    return exists;
  }

  function getTitle() {
    return $('#hoteltitle').text();
  }

  function getUrl() {
    return getTitle().replace(/\s+/g, '-').toLowerCase();
  }

  function setDetails(title, url) {
    // Create our hotel object
    var hotel = {
      name: title,
      hotelurl: url
    };

    // Let's assume this hotel object does not exist in our local storage
    var thisHotelExist = false;

    // Get local storage
    var storedHotels = getHotelDetails() || [];

    // Check if the hotel already exist in local storage
    storedHotels.forEach(function(currHotel) {
      if(currHotel.name === hotel.name) {
        thisHotelExist = true;
      }
    });

    // Only add to local storage if the hotel is not already there
    if(!thisHotelExist) {
      storedHotels.push(hotel);
      localStorage.setItem('hotels', JSON.stringify(storedHotels));
    }
  }

  function removeDetails(title) {

    // Get local storage
    var storedHotels = getHotelDetails() || [];

    // Set an empty new list
    var newStoredHotels = [];

    storedHotels.forEach(function(currHotel) {
      if(currHotel.name !== title) {
        newStoredHotels.push(currHotel);
      }
    });

    localStorage.setItem('hotels', JSON.stringify(newStoredHotels));
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
             'class="ui-btn ui-corner-all ui-icon-arrow-r ui-btn-icon-right">' +
              detail.name +
          '</a>';
      });

      $('#hotel').html(hotel);

    } else {
      $('#nostorage').html('You do not have any hotels in your list yet');
    }
  }

});

// Inititialize map (has to be global [don't know why])
function initialize(position) {

  var lat = position.coords.latitude;
  var lon = position.coords.longitude;

  var currentPosition        = new google.maps.LatLng(lat, lon);
  var churchillHotelPosition = new google.maps.LatLng(51.52307,-0.12426);

  var mapOptions = {
    zoom: 12,
    center: currentPosition,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
    }
  };

  var target   = document.getElementById('map-canvas');
  var hotelMap = new google.maps.Map(target, mapOptions);

  var currentPositionImage = 'http://goo.gl/JGqmEh';

  var userPosition = new google.maps.Marker({
    position: currentPosition,
    map: hotelMap,
    icon: currentPositionImage,
    title: 'You are here'
  });

  var churchillHotelMarkerImage = 'http://goo.gl/3UKr2k';

  var churchillPosition = new google.maps.Marker({
    position: churchillHotelPosition,
    map: hotelMap,
    icon: churchillHotelMarkerImage,
    title: 'Churchill Hotel'
  });

  var churchillHotelInfo = '' +
    '<div id="mappopup">' +
      '<h4>Churchill Hotel</h4>' +
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
