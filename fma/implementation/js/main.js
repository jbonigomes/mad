
$(document).on('pagecreate', '#accommodation', function() {
  /* Event listeners */

  /* Favourites button click */
  // we don't need to check for local storage here, since
  // this button will only exist in the DOM if local storage is present
  // http://www.gajotres.net/prevent-jquery-multiple-event-triggering/
  $('body').on('click', '.favouritesbtn', function(e) {

    if(e.handled !== true) {
      
      e.handled = true;

      var favbtn = $(this);

      // get the accommodation id
      var favbtnid = favbtn.data('accommodation-id');

      $.get('data/accommodation.json', function(results) {

        var result = getAccommodationById(results, favbtnid);

        // if the accommodation exists in local storage
        if(isFavourite(favbtnid)) {
          // remove it
          removeDetails(favbtnid);
          // and give the user a visual feedback
          favbtn.removeClass('active');
        } else {
          // otherwise, add it to local storage
          setDetails(result);
          // and give the user some visual feedback
          favbtn.addClass('active');
        }
      }, 'json');
    }
  });
});


// Apply the theme globally
$(document).bind('mobileinit', function () {
  $.mobile.page.prototype.options.theme = 'd';
});


// Gallery must happen in the pageshow event to render correctly
$(document).on('pageshow', '#gallery', function() {  
  // inject the slider html
  $('.galleryimages ul').html(getGalleryHTML(getUrlId()));

  // Initialize the gallery
  galleryInit('.galleryimages');
});


// All the other pages act upon the pagecontainerbefore show event
$(document).on('pagecontainerbeforeshow', function(e, ui) {

  // get the page id
  var page = ui.toPage[0].id;
  
  // login page
  if(page == 'login') {
    // create the fancy iOS checkbox
    var elem = document.querySelector('.js-switch');
    var init = new Switchery(elem, { color: '#AADD00' });
  }

  // map page
  if(page == 'map') {
    // test if geolocation is supported
    if(navigator.geolocation) {
      // get the accommodation id
      var thisId = getUrlId();

      // get the data
      $.get('data/accommodation.json', function(results) {
        
        // filter the data to get only this accommodation
        var accommodationData = getAccommodationById(results, thisId);

        // set the data for google maps
        var config = {
          lat: accommodationData.lat,
          lon: accommodationData.lon,
          currPosImg: 'img/currentLocation.png',
          pinPosImg: 'img/mapPin.png',
          mapElement: 'map-canvas',
          currPosTxt: 'You are here',
          markerPosTxt: accommodationData.name,
          infobox: {
            title: accommodationData.name,
            content: accommodationData.description,
            url: '/accommodation.html?id=' + thisId,
            linktext: 'Details',
            external: false
          }
        };

        // instanciate google maps
        initialise(config);
      }, 'json');

    } else {
      // if no geolocation supported, inform the user
      $('#nogeolocation')
        .innerHTML = 'Geolocation is not supported by this browser.';
    }
  }

  // contact page
  if(page == 'contact') {
    // test for geolocation
    if(navigator.geolocation) {
      
      // set the data for google maps
      var config = {
        lat: 51.52307,
        lon: -0.12426,
        currPosImg: 'img/currentLocation.png',
        pinPosImg: 'img/mapPin.png',
        mapElement: 'contact-map-canvas',
        currPosTxt: 'You are here',
        markerPosTxt: 'Zedland University',
        infobox: {
          title: 'Zedland University',
          content: 'Welcome to Zedland, home of the Zedland University',
          url: 'http://www.bbk.ac.uk',
          linktext: 'Details',
          external: true
        }
      };

      // instanciate google maps
      initialise(config);

    } else {
      // if no geolocation supported, inform the user
      $('#nogeolocation')
        .innerHTML = 'Geolocation is not supported by this browser.';
    }
  }

  // list of accommodation page
  if(page == 'accommodationlist') {
    // get the data
    $.get('data/accommodation.json', function(results) {

      // inject the html into the DOM
      $('#accommodationlistitems')
        .html(getAccommodationListHTML(getFilteredResults(results, getURLparams())))
        .listview('refresh');

    }, 'json');
  }

  // accommodation page
  if(page == 'accommodation') {
    // some useful vars
    var thisId = getUrlId();

    // get the data
    $.get('data/accommodation.json', function(results) {

      // filter the data, so that we only use this accommodation
      var result = getAccommodationById(results, thisId);

      // Add the html to the DOM
      $('.accommodationbody').html(getAccommodationBodyHTML(result));
      $('.accommodationtitle').html(result.name);
      $('.favourites').html(getFavouritesButtonHTML(thisId));
      $('.gallerylink').html(getImagesLinkHTML(thisId));
      $('.mapslink').html(getMapsLinkHTML(thisId));

    }, 'json');
  }
  
  // favourites page
  if(page === 'favourites') {

    // check if local storage is supported
    if(supportsLocalStorage()) {

      // get all items from local storage
      var accommodationList = getAllAccommodation();

      // display a list of stored accommodation
      if(accommodationList !== null && accommodationList.length > 0) {
        // inject the html into the DOM
        $('#favouriteslist').html(getFavouritesListHTML(accommodationList));

      } else {
        // if we do not have any stored accommodation, inform the user
        $('#nostorage').html('You do not have any accommodation in your list yet');
      }
    } else {
      // if local storage is not supported, inform the user
      $('#nostorage').html('Sorry, Local Storage is not supported by your browser');
    }
  }


  /* Forms */
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
});


/*------------------------------------------------------------------------------
 |
 | Helpers
 |
 -----------------------------------------------------------------------------*/

function getActiveString(id) {
  var str = '';

  if(isFavourite(id)) {
    str = 'active';
  }

  return str;
}


/*------------------------------------------------------------------------------
 |
 | Math - http://stackoverflow.com/questions/5574144/
 |
 -----------------------------------------------------------------------------*/

function getNegative(num) {
  return -Math.abs(parseFloat(num));
}

function getPositive(num) {
  return Math.abs(parseFloat(num));
}


/*------------------------------------------------------------------------------
 |
 | Gallery Init
 |
 -----------------------------------------------------------------------------*/

function galleryInit(elementClass) {

  var offset = 0;
  var height = 0;
  var width  = 0;

  // ensure the images are loaded and for each image
  $(elementClass).find('ul li img').on('load', function() {

    // get the image width and height
    width  = $(this).width();
    height = $(this).height();

    // get the parent <li>
    var listitem = $(this).closest('li');

    // position the <li>
    listitem.css({
      'left': offset,
      'width': width,
      'height': height,
      'margin-top': getNegative(height / 2),
    });

    // sum the items to calculate the slider later
    offset = parseFloat(offset) + parseFloat(width);
  });

  // listen to the right arrow click
  $(elementClass).on('click', 'a.right-arrow', function() {

    // get the <ul> left offset
    var marginleft = getPositive($(elementClass).find('ul').css('margin-left'));

    // only proceed if it is not the last item
    if(marginleft < (offset - width)) {

      // hide the right arrow so users can't click it when it is animating
      $(elementClass).find('a.right-arrow').addClass('hide-arrow');

      // move the <ul>, causing the slide effect
      $(elementClass).find('ul').css({
        'margin-left': getNegative(marginleft) - width
      });

      // roughly after the animation is complete
      setTimeout(function() {
        // show the arrow again only if it is not the last item
        if(marginleft < ((offset - width) - width)) {
          $(elementClass).find('a.right-arrow').removeClass('hide-arrow');
        }
      }, 500);
    }
  });

  // listen to the left arrow click
  $(elementClass).on('click', 'a.left-arrow', function() {

    // show the right arrow, in case it was hidden
    $(elementClass).find('a.right-arrow').removeClass('hide-arrow');

    // get the <ul> left offset
    var marginleft = getPositive($(elementClass).find('ul').css('margin-left'));

    // only proceed if it is not the first item
    if(marginleft > 0) {
      // hide the left arrow so users can't click it when it is animating
      $(elementClass).find('a.left-arrow').addClass('hide-arrow');

      // move the <ul>, causing the slide effect
      $(elementClass).find('ul').css({
        'margin-left': getNegative(marginleft) + width
      });

      // roughly after the animation is complete
      setTimeout(function() {
        // show the left arrow again
        $(elementClass).find('a.left-arrow').removeClass('hide-arrow');
      }, 500);
    }

    // if it is the first item, we should send them back
    if(marginleft == 0) {
      // https://api.jquerymobile.com/jQuery.mobile.navigate/
      window.history.back();
    }
  });
}


/*------------------------------------------------------------------------------
 |
 | URL manipulators
 |
 -----------------------------------------------------------------------------*/

// returns the search part of a URL string
function getURLSearch() {
  return window.location.search.substring(1);
}

// returns the id from the url
function getUrlId() {
  return getURLSearch().replace('id=', '');
}

// returns all parameters from the url
function getURLparams() {
  var paramsArray = getURLSearch().split('&');
  var returnArray = [];

  paramsArray.forEach(function(param) {
    
    splitedParams = param.split('=');

    returnArray.push({
      name: splitedParams[0],
      value: splitedParams[1]
    });

  });

  return returnArray;
}


/*------------------------------------------------------------------------------
 |
 | Data Filters
 |
 -----------------------------------------------------------------------------*/

// checks if an accommodation is within a set of parameters
function meetFilters(result, params) {

  var allFiltersMet = [];

  params.forEach(function(param) {
    switch(param.name) {
      case 'min':
        if(result.price >= param.value) {
          allFiltersMet.push(true);
        }
        break;

      case 'max':
        if(result.price <= param.value) {
          allFiltersMet.push(true);
        }
        break;

      case 'stars':
        if(result.stars == param.value) {
          allFiltersMet.push(true);
        }
        break;

      case 'location':
        if(result.location.toLowerCase() == param.value.toLowerCase()) {
          allFiltersMet.push(true);
        }
        break;

      case 'type':
        if(result.type.toLowerCase() == param.value.toLowerCase()) {
          allFiltersMet.push(true);
        }
        break;
    }
  });

  if(allFiltersMet.length == params.length) {
    return true;
  }

  return false;
}

// returns a list of accommodation that are within a set of parameters
function getFilteredResults(results, params) {

  var filteredResults = [];

  results.forEach(function(result) {
    if(meetFilters(result, params)) {
      filteredResults.push(result);
    }
  });

  return filteredResults;
}

// returns a single accommodation based on the id
function getAccommodationById(results, id) {

  var result = null;

  results.forEach(function(item) {
    if(item.id == id) {
      result = item;
    }
  });

  return result;
}

/*------------------------------------------------------------------------------
 |
 | HTML builders
 |
 -----------------------------------------------------------------------------*/

function getImagesLinkHTML(id) {
  return '<a href="gallery.html?id=' + id + '">View images</a>';
}

function getMapsLinkHTML(id) {
  return '<a href="maps.html?id=' + id + '">View map</a>';
}

function getAccommodationBodyHTML(accommodation) {
  return '' +
    '<p class="accommodationstars">'+getStarsHTML(accommodation.stars)+'</p>'+
    '<p class="accommodationintro">' +
      '<span>'+accommodation.type+' @ '+accommodation.location+'</span>'+
      accommodation.description+
      '<span class="price">&pound'+accommodation.price+'pw</span>'+
    '</p>';
}

function getFavouritesButtonHTML(id) {
  var html = '<a href="#" class="ui-btn ui-corner-all">No Local Storage</a>';

  if(supportsLocalStorage()) {
    html = '' +
      '<a href="#" ' +
         'data-accommodation-id="' + id + '" ' +
         'class="ui-btn ui-icon-star ui-corner-all ui-btn-icon-left favouritesbtn ' + getActiveString(id) + '">' +
        'Favourites' +
      '</a>';
  }

  return html;
}

function getAccommodationListHTML(list) {
  var accommodation = '';

  list.forEach(function(item) {
    accommodation += '' +
      '<li>' +
        '<a href="accommodation.html?id=' + item.id + '" class="ui-alt-icon">' +
          '<img src="img/locations/thumb/accommodation_' + item.id + '.jpg" alt="Accommodation">' +
          '<h3>' + item.name + '</h3>' +
          '<p>' +
            getStarsHTML(item.stars) + '<br/>' +
            '<span class="left">' +
              item.type + ' @ ' + item.location +
            '</span>' +
            '<span class="right">&pound;' + item.price + 'pw</span>' +
          '</p>' +
        '</a>' +
      '</li>';
  });

  return accommodation;
}

function getFavouritesListHTML(details) {
  var accommodation = '';

  details.forEach(function(detail) {
    accommodation += '' +
      '<a href="accommodation.html?id=' + detail.id + '"' +
        '   class="ui-btn ui-corner-all ui-icon-arrow-r ui-btn-icon-right">' +
        detail.name +
      '</a>';
  });

  return accommodation;
}

function getStarsHTML(number) {

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

function getGalleryHTML(id) {
  return '' +
    '<li>' +
      '<img src="img/locations/default/accommodation_' + id + '.jpg" alt="Accommodation">' +
    '</li>' +
    '<li>' +
      '<img src="img/locations/green/accommodation_' + id + '.jpg" alt="Accommodation">' +
    '</li>' +
    '<li>' +
      '<img src="img/locations/blue/accommodation_' + id + '.jpg" alt="Accommodation">' +
    '</li>' +
    '<li>' +
      '<img src="img/locations/red/accommodation_' + id + '.jpg" alt="Accommodation">' +
    '</li>';
}


/*------------------------------------------------------------------------------
 |
 | Local Storage
 |
 -----------------------------------------------------------------------------*/


// check if local storage is supported
function supportsLocalStorage() {
  return typeof(Storage) !== undefined;
}

// check if an accommodation is in local storage
function isFavourite(id) {

  var exists = false;
  var storedAccommodation = getAllAccommodation() || [];

  storedAccommodation.forEach(function(accommodation) {
    if(accommodation.id == id) {
      exists = true;
    }
  });

  return exists;
}

// add an accommodation to local storage
function setDetails(accommodation) {

  var storedAccommodation = getAllAccommodation() || [];

  if(!isFavourite(accommodation.id)) {
    storedAccommodation.push(accommodation);
    localStorage.setItem('accommodation', JSON.stringify(storedAccommodation));
  }
}

// remove an accommodation from local storage
function removeDetails(id) {

  var storedAccommodation    = getAllAccommodation() || [];
  var newStoredAccommodation = [];

  storedAccommodation.forEach(function(currAccommodation) {
    if(currAccommodation.id != id) {
      newStoredAccommodation.push(currAccommodation);
    }
  });

  localStorage.removeItem('accommodation');
  localStorage.setItem('accommodation', JSON.stringify(newStoredAccommodation));
}

// get all accommodation from local storage
function getAllAccommodation() {
  return JSON.parse(localStorage.getItem('accommodation'));
}


/*------------------------------------------------------------------------------
 |
 | Maps
 |
 -----------------------------------------------------------------------------*/

// initialize google maps
function initialise(config) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    var currentPosition = new google.maps.LatLng(lat, lon);
    var zedlandPosition = new google.maps.LatLng(config.lat, config.lon);

    var mapOptions = {
      zoom: 13,
      center: zedlandPosition,
      styles: getMapStyles()
    };

    var target = document.getElementById(config.mapElement);
    var mapObj = new google.maps.Map(target, mapOptions);

    var currentPositionMarker = makeMarker({
      position: currentPosition,
      map: mapObj,
      icon: config.currPosImg,
      title: config.currPosTxt
    });

    var zedlandPositionMarker = makeMarker({
      position: zedlandPosition,
      map: mapObj,
      icon: config.pinPosImg,
      title: config.markerPosTxt
    });

    var zedlandInfoBox = makeInfoBox(config.infobox);

    google.maps.event.addListener(zedlandPositionMarker, 'click', function() {
      zedlandInfoBox.open(mapObj, zedlandPositionMarker);
    });
  });
}

// make google maps infobox
function makeInfoBox(config) {
  var html = '' +
    '<div class="mappopup">' +
      '<h4>' + config.title + '</h4>' +
      '<p>' + config.content + '</p>' +
      '<a href="' + config.url + '" ' + (config.external ? 'target="_blank"' : '') + '>' +
        config.linktext +
      '</a>' +
    '</div>';

  return new google.maps.InfoWindow({
    content: html
  });
}

// make a google maps marker
function makeMarker(config) {
  return new google.maps.Marker({
    position: config.position,
    map: config.map,
    icon: config.icon,
    title: config.title
  });
}

// default styles for the maps
// https://snazzymaps.com/
function getMapStyles() {
  return [
    {
      'featureType': 'landscape.man_made',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#e9e5dc'
        }
      ]
    },
    {
      'featureType': 'landscape.natural',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'visibility': 'on'
        },
        {
          'color': '#b8cb93'
        }
      ]
    },
    {
      'featureType': 'poi',
      'elementType': 'all',
      'stylers': [
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'poi.business',
      'elementType': 'all',
      'stylers': [
        {
          'visibility': 'simplified'
        }
      ]
    },
    {
      'featureType': 'poi.medical',
      'elementType': 'all',
      'stylers': [
        {
          'visibility': 'on'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'all',
      'stylers': [
        {
          'visibility': 'on'
        }
      ]
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#ccdca1'
        }
      ]
    },
    {
      'featureType': 'poi.sports_complex',
      'elementType': 'all',
      'stylers': [
        {
          'visibility': 'on'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'hue': '#ff0000'
        },
        {
          'saturation': -100
        },
        {
          'lightness': 99
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType':'geometry.stroke',
      'stylers': [
        {
          'color':'#808080'
        },
        {
          'lightness': 54
        },
        {
          'visibility': 'off'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#767676'
        }
      ]
    },
    {
      'featureType': 'road',
      'elementType': 'labels.text.stroke',
      'stylers': [
        {
          'color': '#ffffff'
        }
      ]
    },
    {
      'featureType': 'water',
      'elementType': 'all',
      'stylers': [
        {
          'saturation': 43
        },
        {
          'lightness': -11
        },
        {
          'color': '#89cada'
        }
      ]
    }
  ];
}
