
$(document).on("pageinit", function() {

    // BBK Lat/Lng
    var defaultLatLng = new google.maps.LatLng(51.521951, -0.130204);

    drawMap(defaultLatLng);

    function drawMap(latlng) {
        var myOptions = {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google
            .maps
            .Map(document.getElementById("map-canvas"), myOptions);

        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Greetings!"
        });
    }
});
