require('expose?$!expose?jQuery!jquery');
require('../../node_modules/materialize-css/dist/js/materialize.js');
var d3 = require('d3');
var Vue = require('vue');

var app = new Vue({
    el: '#app',
    data: {
        locations: [{
            lat: 43.05948172752397,
            lng: 141.2884283065796,
            address: '北海道札幌市西区山の手１条１３丁目５−１７',
            range: 100,
            uid: 0,
            display: true
        }, {
            lat: 43.06913858232447,
            lng: 141.34576320648193,
            address: '北海道札幌市北区北７条西６丁目２−８',
            range: 200,
            uid: 1,
            display: true
        }, {
            lat: 43.043927231600534,
            lng: 141.4209508895874,
            address: '北海道札幌市白石区本通（北）９丁目北４−８',
            range: 250,
            uid: 2,
            display: true
        }],
        maxuid: 2
    },
    ready: function() {
        this.$broadcast('root:ready', this.locations);
    },
    events: {
        'add:location': '_addLocation',
        'add:list': '_addLocation',
        'change:display': '_changeDisplay',
        'change:range': '_changeRange'
    },
    methods: {
        _addLocation: function(latlng, uid) {
            var me = this;
            this._useGoogleApi(latlng).done(function(data) {
                var address = data.results[0].formatted_address.split(',')[1].split(' ')[2];
                me.locations.push({
                    lat: latlng.lat,
                    lng: latlng.lng,
                    address: address,
                    range: 200,
                    uid: uid,
                    display: true
                });
            });
        },
        _removeLocation: function(e) {
        },
        _useGoogleApi: function(latlng) {
            var defer = $.Deferred();
            $.ajax({
                url: "http://maps.google.com/maps/api/geocode/json",
                data: {
                    latlng: latlng.lat + ',' + latlng.lng,
                    sensor: false
                },
                dataType: 'json',
                success: defer.resolve,
                error: defer.reject
            });
            return defer.promise();
        },

        _changeDisplay: function(location) {
            this.$broadcast('change:display', location);
        },
        _changeRange: function(location) {
            this.$broadcast('change:range', location);
        }
    },
    components: {
        props: ['locations'],
        inherit: true,
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
                    var latlng = e.latlng;
                    this._onClickMap(latlng);
                }, this);

                $(".button-collapse").sideNav();

            },
            events: {
                'root:ready': '_addCircles',
                'change:display': '_changeDisplay',
                'change:range': '_changeRange'
            },
            methods: {

                _onClickMap: function(latlng) {
                    app.maxuid = app.maxuid + 1;
                    this._addCircle(latlng, app.maxuid);
                    this.$dispatch('add:location', latlng, app.maxuid);
                },

                _addCircle: function(latlng, uid) {
                    var opt = {
                            uid: uid
                        },
                        circle = L.circle([latlng.lat, latlng.lng], 200, opt);
                    this.map.addControl(circle);
                    this.circles.push(circle);
                    this.selectedLatlngs.push(latlng);
                },

                _addCircles: function(locations) {

                    for (var i = 0, len = locations.length; i < len; i++) {
                        var location = locations[i],
                            latlng = {
                                lat: location.lat,
                                lng: location.lng
                            };
                        this._addCircle(latlng, location.uid);
                    }

                },

                _changeDisplay: function(location) {

                    for (var i = 0, len = this.circles.length; i < len; i++) {

                        if (location.uid === this.circles[i].options.uid) {

                            if (location.display) {
                                $(this.circles[i]._container).show();
                            } else {
                                $(this.circles[i]._container).hide();
                            }

                        }

                    }

                },

                _changeRange: function(location) {

                    for (var i = 0, len = this.circles.length; i < len; i++) {

                        if (location.uid === this.circles[i].options.uid) {

                            this.circles[i].setRadius(location.range);

                        }

                    }
                }

            },
            template:
                '<div id="map" class="z-depth-1"></div>'

        },

        list: {
            props: ['locations'],
            methods: {
                _onClickAddBtn: function() {
                    this.$dispatch('add:list');
                },
                _onChangeRange: function(location) {
                    this.$dispatch('change:range', location);
                },
                _onChangeDispay: function(location) {
                    this.$dispatch('change:display', location);
                }

            },
            template:
            '<div id="list" class="z-depth-1">' +
                '<table id="setting" class="highlight">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>削除</th>' +
                            '<th>住所</th>' +
                            '<th>範囲</th>' +
                            '<th>表示</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        '<tr v-repeat="locations">' +
                            '<td><p><input type="checkbox" id="{{uid}}" /><label for="{{uid}}"></label></p></td>' +
                            '<td>{{address}}</td>' +
                            '<td><div class="range-field"><input type="range" min="50" max="400" v-model="range" v-on="change: _onChangeRange(this)" /><span class="thumb"><span class="value"></span></span></div></td>' +
                            '<td><div class="switch"><label><input type="checkbox" v-on="change: _onChangeDispay(this)" v-model="display" /><span class="lever"></span></label></div></td>' +
                        '</tr>' +
                    '</tbody>' +
                    '<tfoot>' +
                        '<tr>' +
                            '<td colspan="6"><a class="btn-floating btn-large waves-effect waves-light red right"><i class="material-icons">delete</i></a><a class="btn-floating btn-large waves-effect waves-light right" v-on="click: _onClickAddBtn"><i class="material-icons">add</i></a></td>' +
                        '</tr>' +
                    '</tfoot>' +
                '</table>' +
            '</div>'
        }
    }
});
