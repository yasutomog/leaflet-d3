var $ = require('jquery');
var d3 = require('d3');

$(function(){

    d3.json("./data/japan.geojson", function(json) {
        mapdraw(json)
    });


    function mapdraw(json){

        //地形データ取得
        if (json.type === "Topology"){
            //読み込みファイルがtopojsonの場合(json.objects.△△)　「△△」は変換時のgeojsonファイル名に合わせる
            var geojson = topojson.feature(json, json.objects.ken)
        } else {
            var geojson = json;
        }


        //Leaflet初期設定
        var map = L.map('map').setView([39.702053, 141.15448379999998], 5);
        var mapLink = '<a target="_blank" href="http://portal.cyberjapan.jp/help/termsofuse.html">国土地理院 地理院地図 標準地図</a>';

        //Tile Map Serviceの指定
        L.tileLayer(
            'http://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
                attribution: '© ' + mapLink + ' Contributors',
                maxZoom: 18,
            }).addTo(map);


        //Leafletに用意されたsvgを使う
        map._initPathRoot();

        // svg要素を選択
        var svg = d3.select("#map").select("svg");
        var g = svg.append("g");

        //緯度経度->パスジェネレーター関数作成
        var transform = d3.geo.transform({point: projectPoint});
        var path = d3.geo.path().projection(transform);

        console.log(geojson.features);

        featureElement = g.selectAll("path")
            .data(geojson.features)
            .enter()
            .append("path")
            .attr({
                "stroke": "red",
                "fill": "green",
                "fill-opacity": 0.4
            });

        map.on("viewreset", update);

        update();

        //pathのd属性を更新
        function update() {
            featureElement.attr("d", path);
        }

        //位置→座標変換
        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }

    }

});
