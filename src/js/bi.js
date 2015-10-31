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
            range: 50,
            uid: 0,
            display: true,
            type: "1",
            delflg: false
        }, {
            lat: 43.06913858232447,
            lng: 141.34576320648193,
            address: '北海道札幌市北区北７条西６丁目２−８',
            range: 200,
            uid: 1,
            display: true,
            type: "2",
            delflg: false
        }, {
            lat: 43.043927231600534,
            lng: 141.4209508895874,
            address: '北海道札幌市白石区本通（北）９丁目北４−８',
            range: 250,
            uid: 2,
            display: true,
            type: "3",
            delflg: false
        }, {
            lat: 43.05822747893088,
            lng: 141.3679075241089,
            address: '北海道札幌市西区山の手１条１３丁目５−１７',
            range: 50,
            uid: 3,
            display: true,
            type: "1",
            delflg: false
        }, {
            lat: 43.04530722536699,
            lng: 141.37614727020264,
            address: '北海道札幌市北区北７条西６丁目２−８',
            range: 200,
            uid: 4,
            display: true,
            type: "2",
            delflg: false
        }, {
            lat: 43.08757017184191,
            lng: 141.35554790496823,
            address: '北海道札幌市白石区本通（北）９丁目北４−８',
            range: 250,
            uid: 5,
            display: true,
            type: "3",
            delflg: false
        }, {
            lat: 43.08945063454082,
            lng: 141.29563808441162,
            address: '北海道札幌市西区山の手１条１３丁目５−１７',
            range: 50,
            uid: 6,
            display: true,
            type: "1",
            delflg: false
        }, {
            lat: 43.063745980830284,
            lng: 141.3136625289917,
            address: '北海道札幌市北区北７条西６丁目２−８',
            range: 200,
            uid: 7,
            display: true,
            type: "2",
            delflg: false
        }, {
            lat: 43.0311294472567,
            lng: 141.32087230682373,
            address: '北海道札幌市白石区本通（北）９丁目北４−８',
            range: 250,
            uid: 8,
            display: true,
            type: "3",
            delflg: false
        }, {
            lat: 43.04267266487463,
            lng: 141.29117488861084,
            address: '北海道札幌市西区山の手１条１３丁目５−１７',
            range: 50,
            uid: 9,
            display: true,
            type: "1",
            delflg: false
        }, {
            lat: 43.05333566427254,
            lng: 141.33718013763425,
            address: '北海道札幌市北区北７条西６丁目２−８',
            range: 200,
            uid: 10,
            display: true,
            type: "2",
            delflg: false
        }, {
            lat: 43.086441866511805,
            lng: 141.3279104232788,
            address: '北海道札幌市白石区本通（北）９丁目北４−８',
            range: 250,
            uid: 11,
            display: true,
            type: "3",
            delflg: false
        }],
        maxuid: 11
    },
    ready: function() {
        this.$broadcast('root:ready', this.locations);
    },
    events: {
        'add:location': '_addLocation',
        'change:display': '_changeDisplay',
        'change:range': '_changeRange',
        'change:type': '_onChangeType',
        'click:delbtn': '_removeLocation',
        'mouseover:listrow': '_onMouseoverListRow',
        'mouseout:listrow': '_onMouseoutListRow'
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
                    display: true,
                    type: "1",
                    delflg: false
                });
            });

            this.$broadcast('add:location', me.locations);

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
            var me = this;
            this.$broadcast('change:range', location);
            this.$broadcast('change:locations', me.locations);
        },

        _onChangeType: function(location) {
            var me = this;
            this.$broadcast('change:type', location);
            this.$broadcast('change:locations', me.locations);
        },

        _removeLocation: function() {

            var delLocs = this.locations.filter(function(item) {
                return (item.delflg);
            });

            this.locations = this.locations.filter(function(item) {
                return !(item.delflg);
            });

            this.$broadcast('click:delbtn', delLocs);
        },

        _onMouseoverListRow: function(location) {
            this.$broadcast('mouseover:listrow', location);
        },

        _onMouseoutListRow: function(location) {
            this.$broadcast('mouseout:listrow', location);
        },

        _choiceColor: function(type) {
            if (type === "2") {
                return '#ff1744';
            } else if (type === "3") {
                return '#d500f9';
            } else {
                return '#2979ff';
            }
        }

    },
    components: {
        map: {
            props: ['locations'],
            inherit: true,
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
                'change:range': '_changeRange',
                'change:type': '_changeType',
                'click:delbtn': '_removeCircles',
                'mouseover:listrow': '_onMouseoverListRow',
                'mouseout:listrow': '_onMouseoutListRow'
            },
            methods: {

                _onClickMap: function(latlng) {
console.log(latlng);
                    app.maxuid = app.maxuid + 1;
                    this._addCircle(latlng, app.maxuid);
                    this.$dispatch('add:location', latlng, app.maxuid);

                },

                _addMarker: function(latlng) {

                    L.marker([latlng.lat, latlng.lng]).addTo(this.map);

                },

                _addCircle: function(latlng, uid, type, range) {

                    var color = this._choiceColor(type),
                        opt = {
                            uid: uid,
                            color: color
                        },
                        r = range === undefined ? 200 : range,
                        circle = L.circle([latlng.lat, latlng.lng], r, opt);
                    this.map.addControl(circle);
                    this.circles.push(circle);
                    this.selectedLatlngs.push(latlng);

                    this._addMarker(latlng);

                },

                _addCircles: function(locations) {

                    for (var i = 0, len = locations.length; i < len; i++) {
                        var location = locations[i],
                            latlng = {
                                lat: location.lat,
                                lng: location.lng
                            };
                        this._addCircle(latlng, location.uid, location.type, location.range);
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

                },

                _changeType: function(location) {

                    for (var i = 0, len = this.circles.length; i < len; i++) {

                        if (location.uid === this.circles[i].options.uid) {

                            var color = this._choiceColor(location.type);
                            this.circles[i].setStyle({color: color});

                        }

                    }

                    //this.$dispatch('change:type', location);

                },

                _removeCircles: function(delLocs) {

                    for (var i = 0, dlen = delLocs.length; i < dlen; i++) {

                        var delUid = delLocs[i].uid;

                        for (var j = 0, clen = this.circles.length; j < clen; j++) {

                            if (delUid === this.circles[j].options.uid) {

                                this.map.removeLayer(this.circles[j]);
                                break;

                            }

                        }

                    }

                },

                _onMouseoverListRow: function(location) {

                    for (var i = 0, len = this.circles.length; i < len; i++) {

                        if (location.uid === this.circles[i].options.uid) {

                            this.circles[i].setStyle({opacity: 0.9});

                        }

                    }

                },

                _onMouseoutListRow: function(location) {

                    for (var i = 0, len = this.circles.length; i < len; i++) {

                        if (location.uid === this.circles[i].options.uid) {

                            this.circles[i].setStyle({opacity: 0.5});

                        }

                    }

                }

            },
            template:
                '<div id="map" class="z-depth-1"></div>'

        },

        list: {
            props: ['locations'],
            events: {
                'root:ready': '_onReady'
            },
            methods: {

                _onChangeRange: function(location) {
                    this.$dispatch('change:range', location);
                },

                _onChangeDispay: function(location) {
                    this.$dispatch('change:display', location);
                },

                _onChangeType: function(location) {
                    this.$dispatch('change:type', location);
                },

                _onReady: function() {
                    $('select').material_select();
                },

                _onClickDeleteBtn: function() {
                    this.$dispatch('click:delbtn');
                },

                _onMouseoverRow: function(location) {
                    this.$dispatch('mouseover:listrow', location);
                },

                _onMouseoutRow: function(location) {
                    this.$dispatch('mouseout:listrow', location);
                }

            },
            template:
            '<div id="list" class="z-depth-1">' +
            '<table id="setting" class="highlight">' +
            '<thead>' +
            '<tr>' +
            '<th>削除</th>' +
            '<th>種類</th>' +
            '<th>住所</th>' +
            '<th>範囲</th>' +
            '<th>表示</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr v-repeat="locations" v-on="mouseover: _onMouseoverRow(this), mouseout: _onMouseoutRow(this)">' +
            '<td><p><input type="checkbox" id="{{uid}}" v-model="delflg" /><label for="{{uid}}"></label></p></td>' +
            '<td><select class="browser-default" v-model="type" v-on="change: _onChangeType(this)"><option value="1">飲食店</option><option value="2">病院</option><option value="3">公園</option></select></td>' +
            '<td>{{address}}</td>' +
            '<td><div class="range-field"><input type="range" min="50" max="400" v-model="range" v-on="change: _onChangeRange(this)" /><span class="thumb"><span class="value"></span></span></div></td>' +
            '<td><div class="switch"><label><input type="checkbox" v-on="change: _onChangeDispay(this)" v-model="display" /><span class="lever"></span></label></div></td>' +
            '</tr>' +
            '</tbody>' +
            '<tfoot>' +
            '<tr>' +
            '<td colspan="5"><a class="btn-floating btn-large waves-effect waves-light red right" v-on="click: _onClickDeleteBtn"><i class="material-icons">delete</i></a></td>' +
            '</tr>' +
            '</tfoot>' +
            '</table>' +
            '</div>'
        },

        graph1: {
            props: ['locations'],
            pieChart: {},
            pie: {},
            arc: {},
            events: {
                'root:ready': '_onReady',
                'add:location': '_updatePieChart',
                'change:locations': '_updatePieChart'
            },
            methods: {

                _onReady: function(locations) {
                    this._dashboard('#dashboard1', locations);
                },

                _dashboard: function(id, locations) {

                    var me = this,
                        tr = me._createTotalRange(locations);

                    me._pieChart(tr, id);

                },

                _pieChart: function(pD, id) {

                    var me = this,
                        pieDim = {
                            w: 200,
                            h: 200
                        };
                    pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

                    me.pieChart = d3.select(id).append("svg")
                        .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
                        .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");

                    // create function to draw the arcs of the pie slices.
                    me.arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(pieDim.r - 50);

                    // create a function to compute the pie slice angles.
                    me.pie = d3.layout.pie().sort(null).value(function(d) {
                        return d.freq;
                    });

                    // Draw the pie slices.
                    me.pieChart.selectAll("path").data(me.pie(pD)).enter().append("path").attr("d", me.arc)
                        .each(function(d) {
                            this._current = d;
                        })
                        .style("fill", function(d) {
                            return me.segColor(d.data.type);
                        });

                },

                segColor: function(c) {

                    return {
                        1:"#80d8ff", 2:"#ff8a80",3:"#b388ff"
                    }[c];

                },

                _updatePieChart: function(locations) {

                    var me = this,
                        tr = me._createTotalRange(locations);

                    me.pieChart.selectAll("path").data(me.pie(tr)).transition().duration(500)
                        .attrTween("d", function(a){
                            var i = d3.interpolate(this._current, a);
                            this._current = i(0);
                            return function(t) {
                                return me.arc(i(t));
                            };
                        });


                },

                _createTotalRange: function(locations) {

                    var tr = ["1","2","3"].map(function(d){
                        return {
                            type: d,
                            freq: d3.sum(locations.map(function(t) {
                                if (t.type === d) {
                                    return t.range;
                                }
                            }))
                        };
                    });
                    return tr;

                }


            },
            template:
                '<div id="dashboard1"></div>'
        },

        graph2: {
            props: ['locations'],
            barChart: {},
            x: {},
            y: {},
            xAxis: {},
            yAxis: {},
            height: 0,
            events: {
                'root:ready': '_onReady',
                'add:location': '_updateBarChart',
                'change:locations': '_updateBarChart'
            },
            methods: {

                _onReady: function(locations) {
                    this._dashboard('#dashboard2', locations);
                },

                _dashboard: function(id, locations) {

                    var me = this,
                        tr = me._createTotalRange(locations);

                    me._barChart(tr, id);

                },

                _barChart: function(pD, id) {

                    var me = this,
                        margin = {top: 20, right: 20, bottom: 30, left: 40},
                        width = 300 - margin.left - margin.right;

                    me.height = 200 - margin.top - margin.bottom;

                    me.x = d3.scale.ordinal().rangeRoundBands([0, width], .4);
                    me.y = d3.scale.linear().range([me.height, 0]);

                    me.xAxis = d3.svg.axis().scale(me.x).orient("bottom");
                    me.yAxis = d3.svg.axis().scale(me.y).orient("left").ticks(5);

                    me.barChart = d3.select(id).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", me.height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    me.x.domain(pD.map(function(d) {
                        return d.type;
                    }));
                    me.y.domain([0, d3.max(pD, function(d) {
                        return d.freq;
                    })]);

                    me.barChart.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + me.height + ")")
                        .call(me.xAxis);

                    me.barChart.append("g")
                        .attr("class", "y axis")
                        .call(me.yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end");

                    me.barChart.selectAll(".bar")
                        .data(pD)
                        .enter().append("rect")
                        .attr("class", function(d) { return "bar bar" + d.type; })
                        .attr("x", function(d) { return me.x(d.type); })
                        .attr("width", me.x.rangeBand())
                        .attr("y", function(d) { return me.y(d.freq); })
                        .attr("height", function(d) { return me.height - me.y(d.freq); });

                },

                _updateBarChart: function(locations) {

                    var me = this,
                        tr = me._createTotalRange(locations);

                    me.barChart.selectAll(".bar")
                        .data(tr)
                        .transition()
                        .duration(1000)
                        .attr("y", function(d) { return me.y(d.freq); })
                        .attr("height", function(d) { return me.height - me.y(d.freq); });

                },

                _createTotalRange: function(locations) {

                    var tr = ["1","2","3"].map(function(d){
                        return {
                            type: d,
                            freq: d3.sum(locations.map(function(t) {
                                if (t.type === d) {
                                    return t.range;
                                }
                            }))
                        };
                    });
                    return tr;

                }


            },
            template:
                '<div id="dashboard2"></div>'
        },

        graph3: {
            props: ['locations'],
            lineChart: {},
            //line: {},
            //xAxis: {},
            //yAxis: {},
            height: 0,
            events: {
                'root:ready': '_onReady',
                'add:location': '_updateLineChart',
                'change:locations': '_updateLineChart'
            },
            methods: {

                _onReady: function(locations) {
                    this._dashboard('#dashboard3', locations);
                },

                _dashboard: function(id, locations) {

                    var me = this;
                    me._lineChart(locations, id);

                },

                _lineChart: function(locations, id) {

                    var me = this,
                        margin = {top: 20, right: 20, bottom: 30, left: 50},
                        width = 400 - margin.left - margin.right;

                    me.height = 250 - margin.top - margin.bottom;

                    me.lineChart = d3.select(id).append("svg")
                        .attr("width", width)
                        .attr("height", me.height);

                    var xScale = d3.scale.linear()
                        .domain([1, 15])
                        .range([0, width]);

                    var yScale = d3.scale.linear()
                        .domain([50, 300])
                        .range([me.height, 0]);

                    var colorCategoryScale = d3.scale.category10();

                    var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .tickSize(3, -me.height)
                        .tickFormat(function(d){ return d; });

                    var yAxis = d3.svg.axis()
                        .ticks(5)
                        .scale(yScale)
                        .orient("left")
                        .tickSize(3, -width);

                    var line = d3.svg.line()
                        .x(function(d) { return xScale(d.uid); })
                        .y(function(d) { return yScale(d.range); })
                        .interpolate("cardinal");

                    me.lineChart.selectAll("circle")
                        .data(locations)
                        .enter()
                        .append("circle")
                        .attr("r",5)
                        .attr("fill", function(d){ return me.segColor(d.type); })
                        .attr("cx", function(d){ return xScale(d.uid); })
                        .attr("cy", function(d){ return yScale(d.range); });

                    me.lineChart.append("path")
                        .datum(locations)
                        .attr("class", "line")
                        .attr("d", line);

                    me.lineChart.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("y", -10)
                        .attr("x",10)
                        .style("text-anchor", "end");

                    me.lineChart.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + me.height + ")")
                        .call(xAxis);


                },

                segColor: function(c) {

                    return {
                        1:"#80d8ff", 2:"#ff8a80",3:"#b388ff"
                    }[c];

                },

                _updateLineChart: function(locations) {

                    var me = this;

                    me.lineChart.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + me.height + ")")
                        .call(me.xAxis);

                    me.lineChart.append("g")
                        .attr("class", "y axis")
                        .call(me.yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end");

                    me.lineChart.append("path")
                        .datum(locations)
                        .attr("class", "line")
                        .attr("d", me.line);


                    me.barChart.selectAll("path")
                        .data(locations)
                        .transition()
                        .duration(1000)

                }

            },
            template:
                '<div id="dashboard3"></div>'
        }

    }
});
