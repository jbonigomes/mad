function initialize() {
  var myLatlng = new google.maps.LatLng(51.50700,-0.12800);
  var myLatlng2 = new google.maps.LatLng(51.50735,-0.12700);
   var myLatlng3 = new google.maps.LatLng(51.50790,-0.12750);
  var mapOptions = {
    zoom: 15,
    center: myLatlng
  }
  var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
	  icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|FF0000|000000',
      title: 'Location 1 Title'
  });
  
   var marker2 = new google.maps.Marker({
      position: myLatlng2,
      map: map,
	  icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=B|FF0000|000000',
      title: 'Location 2 Title'
  });
  
    var marker3 = new google.maps.Marker({
      position: myLatlng3,
      map: map,
	  icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=C|FF0000|000000',
      title: 'Location 1 Title'
  });
  
    google.maps.event.addListener(marker, 'click', function() { 
      window.location = "http://www.google.com/" 
    }); 
    google.maps.event.addListener(marker2, 'click', function() { 
      window.location = "http://www.google.com/" 
    }); 
	google.maps.event.addListener(marker3, 'click', function() { 
      window.location = "http://www.google.com/" 
    }); 
}

google.maps.event.addDomListener(window, 'load', initialize);