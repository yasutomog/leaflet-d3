require('expose?$!expose?jQuery!jquery');
require('../../node_modules/materialize-css/dist/js/materialize.js');
var d3 = require('d3');
var Vue = require('vue');

var vmMap = new Vue({
    map: '',
    el: '#map',
    data: {
        circles: [],
        selectedLatlngs: []
    },
    created: function() {
        console.log('created');
        // Map位置の設定と表示とリンク付加
        this.map = L.map('map').setView([43.063968, 141.347899], 13);
        mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; ' + mapLink + ' Contributors',
                maxZoom: 18
            }).addTo(this.map);

// Add an SVG element to Leaflet’s overlay pane
        var svg = d3.select(this.map.getPanes().overlayPane).append("svg"),
            g = svg.append("g").attr("class", "leaflet-zoom-hide");

        this.map.on('click', function(e) {
            console.log(e);
            var latlng = e.latlng;
            this.addCircle(latlng);
        }, this);
    },
    compiled: function() {
        console.log('compiled');
    },
    ready: function() {
        console.log('ready');
    },
    methods: {
        addCircle: function(latlng) {
            var circle = L.circle([latlng.lat, latlng.lng], 200).addTo(this.map);
            this.circles.push(circle);
            this.selectedLatlngs.push(latlng);
        },

        addPolyline: function(latlng) {

            var polyline = L.polyline(selectedLatlngs, {color: 'red'}).addTo(this.map);

        }
    }
});

var vmApp = new Vue({
    el: '#app',
    data: {
        mapInfo: [{
            material: 'Acrylic (Transparent)',
            quantity: 25,
            unitPrice: '$2.90',
            value: 100,
            flg: 1
        }, {
            material: 'Acrylic (Transparent)2',
            quantity: 252,
            unitPrice: '$2.902',
            value: 1002,
            flg: 0
        }, {
            material: 'Acrylic (Transparent)3',
            quantity: 252,
            unitPrice: '$2.902',
            value: 1002,
            flg: 0
        }]
    },
    methods: {
        _onClick: function() {
            //debugger;
            this.mapInfo.push({
                material: 'Acrylic (Transparent)4',
                quantity: 252,
                unitPrice: '$2.902',
                value: 1002,
                flg: 0
            });
        }
    }
});

