var $ = require('jquery');
var d3 = require('d3');

$(function(){

    // Map位置の設定と表示とリンク付加
    var map = L.map('map').setView([43.063968, 141.347899], 13);
    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18
        }).addTo(map);

    console.log(map.getPanes().overlayPane);

    // Add an SVG element to Leaflet’s overlay pane
    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    d3.json("../data/location.json", function(geoShape) {

        // create a d3.geo.path to convert GeoJSON to SVG
        var transform = d3.geo.transform({point: projectPoint}),
            path = d3.geo.path().projection(transform);

        // create path elements for each of the features
        d3_features = g.selectAll("path")
            .data(geoShape.features)
            .enter().append("path");

        map.on("viewreset", reset);

        map.on('click', function(e) {
            addCircle(e.latlng);
        });

        reset();

        // fit the SVG element to leaflet's map layer
        function reset() {

            bounds = path.bounds(geoShape);

            var topLeft = bounds[0],
                bottomRight = bounds[1];

            svg .attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            g .attr("transform", "translate(" + -topLeft[0] + ","
                + -topLeft[1] + ")");

            // initialize the path data
            d3_features.attr("d", path)
                .style("fill-opacity", 0.7)
                .attr('fill','blue');
        }

        // Use Leaflet to implement a D3 geometric transformation.
        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }


        function addCircle(latlng) {
            console.log(latlng);
            L.circle([latlng.lat, latlng.lng], 200).addTo(map);
        }


    });
});
