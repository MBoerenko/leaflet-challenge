//Create the center of the map
var myMap = L.map("map", {
    center: [40.7749, -120.4194],
    zoom: 5.25
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Store our API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//  GET color radius call to the query URL
d3.json(queryUrl, function (data) {
    function styleInfo(feature) {
        return {
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.25
        };
    }
    // set different color from magnitude
    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#006400";//darkgreen
            case magnitude > 4:
                return "#ff4500";//orangered"
            case magnitude > 3:
                return "#ffa500";//orange
            case magnitude > 2:
                return "#adff2f";//greenyellow
            case magnitude > 1:
                return "#ffff00";//yellow
            default:
                return "#f0e68c";//khaki
        }
    }
    // set radius from magnitude
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 5;
    }

    // GeoJSON layer
    L.geoJson(data, {
        // Maken cricles
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // cirecle style
        style: styleInfo,


        // popup for each marker
        onEachFeature: function (feature, layer) {
            var timestamp = feature.properties.time;
            var date = new Date(timestamp);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var year = date.getFullYear();
            var month = months[date.getMonth()];
            var date = date.getDate();
            var time = month + ' ' + date + ' ' + year;
            console.log(time)
            layer.bindPopup("<strong>" + feature.properties.place + "</strong><br>Date: " + [time] + "</strong><br>Magnitude: " + feature.properties.mag);
        }
    }).addTo(myMap);

    // Add legend to the map
    var legend = L.control({
        position: "bottomleft"
    });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "info legend"),
            grades = [0, 1, 2, 3, 4, 5];


        // Create legend
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
});