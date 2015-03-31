
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

      var config = {
        lat: 51.52307,
        long: -0.12426,
        currPosImg: '/img/currentLocation.png',
        pinPosImg: '/img/mapPin.png',
        mapElement: 'contact-map-canvas',
        currPosTxt: 'You are here',
        markerPosTxt: 'Zedland University',
        infobox: {
          title: 'Zedland University',
          content: 'Welcome to Zedland, home of the Zedland University',
          url: 'http://www.bbk.ac.uk',
          linktext: 'Details'
        }
      };

      initialise(config);

    } else {

      $('#nogeolocation')
        .innerHTML = 'Geolocation is not supported by this browser.';
    }
  }

  if(page == 'contact') {
    if(navigator.geolocation) {
      
      var config = {
        lat: 51.52307,
        long: -0.12426,
        currPosImg: '/img/currentLocation.png',
        pinPosImg: '/img/mapPin.png',
        mapElement: 'contact-map-canvas',
        currPosTxt: 'You are here',
        markerPosTxt: 'Zedland University',
        infobox: {
          title: 'Zedland University',
          content: 'Welcome to Zedland, home of the Zedland University',
          url: 'http://www.bbk.ac.uk',
          linktext: 'Details'
        }
      };

      initialise(config);

    } else {

      $('#nogeolocation')
        .innerHTML = 'Geolocation is not supported by this browser.';
    }
  }

  if(page == 'accommodationlist') {
    $.get('data/accommodation.json', function(results) {
      var accommodation = "";
      
      results.forEach(function(result) {
        accommodation += '' +
          '<li>' +
            '<a href="accommodation.html?id=' + result.id + '" class="ui-alt-icon">' +
              '<img src="/img/locations/thumb/accommodation_' + result.id + '.jpg">' +
              '<h3>' + result.name + '</h3>' +
              '<p>' +
                getStars(result.stars) + '<br/>' +
                '<span class="left">' +
                  result.type + ' @ ' + result.location +
                '</span>' +
                '<span class="right">&pound;' + result.price + 'pw</span>' +
              '</p>' +
            '</a>' +
          '</li>';
      });

      $('#accommodationlistitems').html(accommodation).listview('refresh');

    }, 'json');
  }

  if(page == 'accommodation') {

    var thisPage = "#" + page;
    var thisUrl  = $(location).attr('search');
    var thisId   = thisUrl.split("=")[1];

    $.get('data/accommodation.json', function(results) {

      var result = getAccommodationById(results, thisId);

      $('body').on('click', '#addbtn', function() {

        if(typeof(Storage) != 'undefined') {

          if($(this).hasClass('active')) {
            removeDetails(thisId);
            $(this).removeClass('active');
          } else {
            setDetails(result, thisId);
            $(this).addClass('active');
          }
        } else {
          $(this).addClass('ui-btn-hidden');
          $('#nostorage').text('Local storage not supported');
        }
      });

      var accommodation = '' +
        '<p>' + getStars(result.stars) + '</p>' +
        '<p>' +
          '<span>' + result.type + ' @ ' + result.location + '</span>' +
          result.description +
          '<span>&pound' + result.price + 'pw</span>' +
        '</p>';

      $('#contentArea', thisPage).html(accommodation);
      $('#accommodationtitle', thisPage).text(result.name);

      var active = '';

      console.log(isFavourite(thisId));

      if(isFavourite(thisId)) {
        active = 'active';
      }

      var favouritesButton = '' +
        '<a id="addbtn" ' +
           'href="#" ' +
           'class="ui-btn ui-icon-star ui-btn-icon-left ui-corner-all '+active+'">' +
          'Favourites'
        '</a>';

      $('.favourites').html(favouritesButton);

    }, 'json');
  }
  
  if(page === 'favourites') {
    if(typeof(Storage) !== undefined) {
      displayAccommodationDetails(getDetails());
    } else {
      $('#nostorage').text('Local storage not supported');
    }
  }

  // Catch login form submition
  $('#frm1').on('submit', function(e) {
    e.preventDefault();
    if($(this).valid()) {
      $.mobile.navigate('index.html');
    }
  });

  // Catch booking form submition
  $('#frm2').on('submit', function(e) {
    e.preventDefault();
    if($(this).valid()) {
      $.mobile.navigate('registered.html');
    }
  });

  // Catch lost password form submition
  $('#frm3').on('submit', function(e) {
    e.preventDefault();
    if($(this).valid()) {
      $.mobile.navigate('lostmessage.html');
    }
  });

  // Validate forms
  $('#frm1').validate();
  $('#frm2').validate();
  $('#frm3').validate();

  function getAccommodationById(results, id) {
    
    var result = null;

    results.forEach(function(item) {
      if(item.id == id) {
        result = item;
      }
    });

    return result;
  }

  function displayAccommodationDetails(details) {

    if(details !== null) {

      var accommodation = '';

      details.forEach(function(detail) {
        accommodation += '' +
          '<a href="accommodation.html?id=' + detail.id + '"' +
          '   class="ui-btn ui-corner-all ui-icon-arrow-r ui-btn-icon-right">' +
              detail.name +
          '</a>';
      });

      $('#favouriteslist').html(accommodation);

    } else {
      $('#nostorage').html('You do not have any accommodation in your list yet');
    }
  }

  function getStars(number) {

    var html = '';

    for(var i = 0; i < 5; i++) {

      html += '<i class="fa fa-star list-star';

      if(number > i) {
        html += ' active-star';
      }

      html += '"></i>';
    }

    return html;
  }

  function isFavourite(id) {

    var exists = false;
    var storedAccommodation = getDetails() || [];

    storedAccommodation.forEach(function(accommodation) {
      if(accommodation.id == id) {
        exists = true;
      }
    });

    return exists;
  }

  function setDetails(accommodation, id) {

    var accommodationExist  = false;
    var storedAccommodation = getDetails() || [];

    storedAccommodation.forEach(function(currAccommodation) {
      if(currAccommodation.name === accommodation.name) {
        accommodationExist = true;
      }
    });

    if(!accommodationExist) {
      storedAccommodation.push(accommodation);
      localStorage.setItem('accommodation', JSON.stringify(storedAccommodation));
    }
  }

  function removeDetails(id) {

    var storedAccommodation    = getDetails() || [];
    var newStoredAccommodation = [];

    storedAccommodation.forEach(function(currAccommodation) {
      if(currAccommodation.id !== id) {
        newStoredAccommodation.push(currAccommodation);
      }
    });

    localStorage.setItem('accommodation', JSON.stringify(newStoredAccommodation));
  }

  function getDetails() {
    return JSON.parse(localStorage.getItem('accommodation'));
  }

  function initialise(config) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;

      var currentPosition = new google.maps.LatLng(lat, lon);
      var zedlandPosition = new google.maps.LatLng(config.lat, config.long);

      var currentPositionImage = config.currPosImg;
      var zedlandPositionImage = config.pinPosImg;

      var mapOptions = {
        zoom: 13,
        center: zedlandPosition,
      };

      var mapstyles = getMapStyles();

      var target = document.getElementById(config.mapElement);
      var mapObj = new google.maps.Map(target, mapOptions);

      var userPosition = makeMarker({
        position: currentPosition,
        map: mapObj,
        icon: currentPositionImage,
        title: config.currPosTxt
      });

      var zedlanPosition = makeMarker({
        position: zedlandPosition,
        map: mapObj,
        icon: zedlandPositionImage,
        title: config.markerPosTxt
      });

      var zedlandInfoBox = makeInfoBox({
        title: config.infobox.title,
        content: config.infobox.content,
        url: config.infobox.url,
        linktext: config.infobox.linktext
      });

      mapObj.setOptions({styles: mapstyles});

      google.maps.event.addListener(zedlanPosition, 'click', function() {
        zedlandInfoBox.open(mapObj, zedlanPosition);
      });
    });
  }

  function makeInfoBox(config) {
    var html = '' +
      '<div id="mappopup">' +
        '<h4>' + config.title + '</h4>' +
        '<p>' + config.content + '</p>' +
        '<a href="' + config.url + '">' + config.linktext + '</a>' +
      '</div>';

    return new google.maps.InfoWindow({
      content: html
    });
  }

  function makeMarker(config) {
    return new google.maps.Marker({
      position: config.position,
      map: config.map,
      icon: config.icon,
      title: config.title
    });
  }

  function getMapStyles() {
    return [
      {
        "featureType":"landscape.man_made",
        "elementType":"geometry.fill",
        "stylers":[
          {
            "color":"#e9e5dc"
          }
        ]
      },
      {
        "featureType":"landscape.natural",
        "elementType":"geometry.fill",
        "stylers":[
          {
            "visibility":"on"
          },
          {
            "color":"#b8cb93"
          }
        ]
      },
      {
        "featureType":"poi",
        "elementType":"all",
        "stylers":[
          {
            "visibility":"off"
          }
        ]
      },
      {
        "featureType":"poi.business",
        "elementType":"all",
        "stylers":[
          {
            "visibility":"simplified"
          }
        ]
      },
      {
        "featureType":"poi.medical",
        "elementType":"all",
        "stylers":[
          {
            "visibility":"on"
          }
        ]
      },
      {
        "featureType":"poi.park",
        "elementType":"all",
        "stylers":[
          {
            "visibility":"on"
          }
        ]
      },
      {
        "featureType":"poi.park",
        "elementType":"geometry.fill",
        "stylers":[
          {
            "color":"#ccdca1"
          }
        ]
      },
      {
        "featureType":"poi.sports_complex",
        "elementType":"all",
        "stylers":[
          {
            "visibility":"on"
          }
        ]
      },
      {
        "featureType":"road",
        "elementType":"geometry.fill",
        "stylers":[
          {
            "hue":"#ff0000"
          },
          {
            "saturation":-100
          },
          {
            "lightness":99
          }
        ]
      },
      {
        "featureType":"road",
        "elementType":"geometry.stroke",
        "stylers":[
          {
            "color":"#808080"
          },
          {
            "lightness":54
          },
          {
            "visibility":"off"
          }
        ]
      },
      {
        "featureType":"road",
        "elementType":"labels.text.fill",
        "stylers":[
          {
            "color":"#767676"
          }
        ]
      },
      {
        "featureType":"road",
        "elementType":"labels.text.stroke",
        "stylers":[
          {
            "color":"#ffffff"
          }
        ]
      },
      {
        "featureType":"water",
        "elementType":"all",
        "stylers":[
          {
            "saturation":43
          },
          {
            "lightness":-11
          },
          {
            "color":"#89cada"
          }
        ]
      }
    ];
  }
});