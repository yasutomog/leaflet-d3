require('expose?$!expose?jQuery!jquery');
require('../../node_modules/materialize-css/dist/js/materialize.js');
var d3 = require('d3');
var Vue = require('vue');

var app = new Vue({
    el: '#app',
    data: {
        maps: [{
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
    events: {
        'add:map': '_onAddMapInfo'
    },
    methods: {
        _onAddMapInfo: function(e) {
            this.maps.push({
                material: 'Acrylic (Transparent)4',
                quantity: 252,
                unitPrice: '$2.902',
                value: 1002,
                flg: 0
            });
        },
        removeMapInfo: function(e) {
        }
    },
    components: {
        map: {
            replace: true,
            map: '',
            data: function() {
                return {
                    circles: [],
                    selectedLatlngs: []
                }
            },
            ready: function() {

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

                $(".button-collapse").sideNav();

            },
            methods: {

                addCircle: function(latlng) {

                    var popup = L.popup()
                        .setLatLng(latlng)
                        .setContent('<div class="row">' +
                        '<form class="col s12"><div>' +
                        '<div class="input-field col s12"><input id="last_name" type="text" class="validate" /><label for="last_name">Last Name</label></div>' +
                        '</div></form>' +
                        '</div>')
                        .openOn(this.map);

                    console.log(latlng.lat);
                    console.log(latlng.lng);

                    var circle = L.circle([latlng.lat, latlng.lng], 200).addTo(this.map);
                    this.circles.push(circle);
                    this.selectedLatlngs.push(latlng);
                },

                addPolyline: function(latlng) {
                    var polyline = L.polyline(selectedLatlngs, {color: 'red'}).addTo(this.map);
                }
            },
            template:
                '<div id="map" class="z-depth-1"></div>'

        },
        list: {
            props: ['maps'],
            methods: {
                _onClick: function() {
                    this.$dispatch('add:map');
                }
            },
            template:
            '<div id="list" class="z-depth-1">' +
                '<table id="setting" class="highlight">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>Material</th>' +
                            '<th>Quantity</th>' +
                            '<th>Unit price</th>' +
                            '<th>value</th>' +
                            '<th>on/off</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        '<tr v-repeat="maps">' +
                            '<td><p><input type="checkbox" id="{{$index}}" /><label for="{{$index}}"></label></p></td>' +
                            '<td>{{quantity}}</td>' +
                            '<td>{{unitPrice}}</td>' +
                            '<td><div class="range-field"><input type="range" min="0" max="100" value="30" /><span class="thumb"><span class="value"></span></span></div></td>' +
                            '<td><div class="switch"><label><input type="checkbox" /><span class="lever"></span></label></div></td>' +
                        '</tr>' +
                    '</tbody>' +
                    '<tfoot>' +
                        '<tr>' +
                            '<td colspan="6"><a class="btn-floating btn-large waves-effect waves-light red right"><i class="material-icons">delete</i></a><a class="btn-floating btn-large waves-effect waves-light right" v-on="click: _onClick"><i class="material-icons">add</i></a></td>' +
                        '</tr>' +
                    '</tfoot>' +
                '</table>' +
            '</div>'
        }
    }
});
