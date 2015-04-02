
// Apply the theme globally
$(document).bind('mobileinit', function () {
  $.mobile.page.prototype.options.theme = 'd';
});

// Gallery must happen in the pageshow event to render correctly
$(document).on('pageshow', '#gallery', function() {  

  // some useful variables
  var thisId = window.location.search.substring(1).replace('id=', '');
  var offset = 0;
  var height = 0;
  var width  = 0;

  // build the html to be injected in the slider
  var galleryList = '' +
    '<li>' +
      '<img src="/img/locations/default/accommodation_' + thisId + '.jpg">' +
    '</li>' +
    '<li>' +
      '<img src="/img/locations/green/accommodation_' + thisId + '.jpg">' +
    '</li>' +
    '<li>' +
      '<img src="/img/locations/blue/accommodation_' + thisId + '.jpg">' +
    '</li>' +
    '<li>' +
      '<img src="/img/locations/red/accommodation_' + thisId + '.jpg">' +
    '</li>';

  // inject the slider html
  $('.galleryimages ul').html(galleryList);

  // ensure the images are loaded and for each image
  $('.galleryimages ul li img').on('load', function() {
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
  $('.galleryimages').on('click', 'a.right-arrow', function() {

    // get the <ul> left offset
    var marginleft = getPositive($('.galleryimages ul').css('margin-left'));

    // only proceed if it is not the last item
    if(marginleft < (offset - width)) {

      // hide the right arrow so users can't click it when it is animating
      $('.galleryimages a.right-arrow').addClass('hide-arrow');

      // move the <ul>, causing the slide effect
      $('.galleryimages ul').css({
        'margin-left': getNegative(marginleft) - width
      });

      // roughly after the animation is complete
      setTimeout(function() {
        // show the arrow again only if it is not the last item
        if(marginleft == offset) {
          $('.galleryimages a.right-arrow').removeClass('hide-arrow');
        }
      }, 500);
    }
  });

  // listen to the left arrow click
  $('.galleryimages').on('click', 'a.left-arrow', function() {

    // show the right arrow, in case it was hidden
    $('.galleryimages a.right-arrow').removeClass('hide-arrow');

    // get the <ul> left offset
    var marginleft = getPositive($('.galleryimages ul').css('margin-left'));

    // only proceed if it is not the first item
    if(marginleft > 0) {
      // hide the left arrow so users can't click it when it is animating
      $('.galleryimages a.left-arrow').addClass('hide-arrow');

      // move the <ul>, causing the slide effect
      $('.galleryimages ul').css({
        'margin-left': getNegative(marginleft) + width
      });

      // roughly after the animation is complete
      setTimeout(function() {
        // show the right arrow again
        $('.galleryimages a.left-arrow').removeClass('hide-arrow');
      }, 500);
    }

    // if it is the first item, we should send them back
    if(marginleft == 0) {
      // https://api.jquerymobile.com/jQuery.mobile.navigate/
      window.history.back();
    }
  });

  // http://stackoverflow.com/questions/5574144/
  function getNegative(num) {
    return -Math.abs(parseFloat(num));
  }

  function getPositive(num) {
    return Math.abs(parseFloat(num));
  }
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
          currPosImg: '/img/currentLocation.png',
          pinPosImg: '/img/mapPin.png',
          mapElement: 'map-canvas',
          currPosTxt: 'You are here',
          markerPosTxt: accommodationData.name,
          infobox: {
            title: accommodationData.name,
            content: accommodationData.description,
            url: '/accommodation.html?id=' + thisId,
            linktext: 'Details'
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

      // prepare our data
      var accommodation   = '';
      var params          = getURLparams();
      var filteredResults = getFilteredResults(results, params);

      // create some html with our data
      filteredResults.forEach(function(result) {
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

      // inject the html into the DOM
      $('#accommodationlistitems').html(accommodation).listview('refresh');

    }, 'json');
  }

  // accommodation page
  if(page == 'accommodation') {

    // some useful vars
    var thisPage = "#" + page;
    var thisUrl  = $(location).attr('search');
    var thisId   = thisUrl.split("=")[1];

    // get the data
    $.get('data/accommodation.json', function(results) {

      // filter the data, so that we only use this accommodation
      var result = getAccommodationById(results, thisId);

      // listen to the add to favourites button
      $('body').on('click', '#favouritesbtn', function() {

        // only proceed if local storage is supported
        if(typeof(Storage) != 'undefined') {
          // if the accommodation exists in local storage
          if(isFavourite(thisId)) {
            // remove it
            removeDetails(thisId);
            // and give the user a visual feedback
            $(this).removeClass('active');
          } else {
            // otherwise, add it to local storage
            setDetails(result, thisId);
            // and give the user some visual feedback
            $(this).addClass('active');
          }
        } else {
          // if local storage is not supported, hide the button
          $(this).addClass('ui-btn-hidden');
          // and inform the user
          $('#nostorage').text('Local storage not supported');
        }
      });

      // html for the accommodation body
      var accommodation = '' +
        '<p class="accommodationstars">' + getStars(result.stars) + '</p>' +
        '<p class="accommodationintro">' +
          '<span>' + result.type + ' @ ' + result.location + '</span>' +
          result.description +
          '<span class="price">&pound' + result.price + 'pw</span>' +
        '</p>';

      // the html for the favourites button
      var active = '';

      if(isFavourite(thisId)) {
        active = 'active';
      }

      var favouritesButton = '' +
        '<a id="favouritesbtn" ' +
           'href="#" ' +
           'class="ui-btn ui-icon-star ui-btn-icon-left ui-corner-all '+active+'">' +
          'Favourites'
        '</a>';

      // the go to maps and images links
      var mapslink   = '<a href="maps.html?id=' + thisId + '">View map</a>';
      var imageslink = '<a href="gallery.html?id=' + thisId + '">View images</a>';

      // Add the html to the DOM
      $('#contentArea', thisPage).html(accommodation);
      $('#accommodationtitle', thisPage).text(result.name);
      $('.favourites').html(favouritesButton);
      $('.gallerylink').html(imageslink);
      $('.mapslink').html(mapslink);

    }, 'json');
  }
  
  // favourites page
  if(page === 'favourites') {
    // if local storage is supported
    if(typeof(Storage) !== undefined) {
      // display a list of stored accommodation
      if(details !== null) {

        // build the list html
        var accommodation = '';

        details.forEach(function(detail) {
          accommodation += '' +
            '<a href="accommodation.html?id=' + detail.id + '"' +
            '   class="ui-btn ui-corner-all ui-icon-arrow-r ui-btn-icon-right">' +
                detail.name +
            '</a>';
        });

        // inject the html into the DOM
        $('#favouriteslist').html(accommodation);

      } else {
        // if we do not have any stored accommodation, inform the user
        $('#nostorage').html('You do not have any accommodation in your list yet');
      }
    } else {
      // otherwise, inform the user
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

  // returns the id from the url
  function getUrlId() {
    return window.location.search.substring(1).replace('id=', '');
  }

  // returns all parameters from the url
  function getURLparams() {
    var baseParams = window.location.search.substring(1);
    var paramsList = baseParams.split('&');
    var paramsObj  = [];

    paramsList.forEach(function(param) {
      
      splitedParams = param.split('=');

      paramsObj.push({
        name: splitedParams[0],
        value: splitedParams[1]
      });

    });

    return paramsObj;
  }

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

  // returns the stars html for a given number
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

  // check if an accommodation is in local storage
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

  // add an accommodation to local storage
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

  // remove an accommodation from local storage
  function removeDetails(id) {

    var storedAccommodation    = getDetails() || [];
    var newStoredAccommodation = [];

    storedAccommodation.forEach(function(currAccommodation) {
      if(currAccommodation.id != id) {
        newStoredAccommodation.push(currAccommodation);
      }
    });

    localStorage.setItem('accommodation', JSON.stringify(newStoredAccommodation));
  }

  // get all accommodation from local storage
  function getDetails() {
    return JSON.parse(localStorage.getItem('accommodation'));
  }

  // initialize google maps
  function initialise(config) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;

      var currentPosition = new google.maps.LatLng(lat, lon);
      var zedlandPosition = new google.maps.LatLng(config.lat, config.lon);

      var currentPositionImage = config.currPosImg;
      var zedlandPositionImage = config.pinPosImg;

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

      var mapOptions = {
        zoom: 13,
        center: zedlandPosition,
      };

      var target = document.getElementById(config.mapElement);
      var mapObj = new google.maps.Map(target, mapOptions);

      mapObj.setOptions({styles: getMapStyles()});

      google.maps.event.addListener(zedlanPosition, 'click', function() {
        zedlandInfoBox.open(mapObj, zedlanPosition);
      });
    });
  }

  // make google maps infobox
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
