
$(document).on('pageinit', '#contact', function() {

  function drawMap(latlng) {
    var myOptions = {
      zoom: 14,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google
      .maps
      .Map(document.getElementById('map-canvas'), myOptions);

    var marker = new google.maps.Marker({
      position: latlng,
      map: map
    });
  }

  drawMap(new google.maps.LatLng(51.521951, -0.130204));

});


$(document).on('pageinit', '#accommodation', function() {

  $('.center').slick({

    arrows: false,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: '60px',

    responsive: [{
      breakpoint: 600,
      settings: {
        slidesToShow: 1
      }
    }]

  });

});
