var $ = require('jquery');
var d3 = require('d3');
var Vue = require('vue');

$(function(){

    var circles = [],
        selectedLatlngs = [];

    // Map位置の設定と表示とリンク付加
    var map = L.map('map').setView([43.063968, 141.347899], 13);
    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18
        }).addTo(map);

    // Add an SVG element to Leaflet’s overlay pane
    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    map.on('click', function(e) {
        console.log(e);
        var latlng = e.latlng;
        addCircle(latlng);
        //addPolyline(latlng);

    });
    map.on('dblclick', function(e) {
        console.log(e);
        var latlng = e.latlng;
        addPolyline(latlng);

    });

    function addCircle(latlng) {
        var circle = L.circle([latlng.lat, latlng.lng], 200).addTo(map);
        circles.push(circle);
        selectedLatlngs.push(latlng);
    }

    function addPolyline(latlng) {

        var latlng1 = {
                lat: 43.06449846533173,
                lng: 141.3603973388672
            },
            latlng2 = {
                lat: 43.067759124772664,
                lng: 141.31507873535156
            },
            latlng3 = {
                lat: 43.03627397550502,
                lng: 141.3658905029297
            },
            latlng4 = {
                lat: 43.04066530475004,
                lng: 141.27851486206055
            };

        var polyline = L.polyline(selectedLatlngs, {color: 'red'}).addTo(map);

    }

    Vue.directive('mdl', {
        bind: function() {
            componentHandler.upgradeElement(this.el);
        }
    });
    Vue.directive('mdl-progress', function(val) {
        // The directive may be called before the element have been upgraded
        if (!this.el.MaterialProgress)
            componentHandler.upgradeElement(this.el);
        this.el.MaterialProgress.setProgress(val);
    });

    var vm = new Vue({
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
                //this.$data.$add('mapInfo', {
                //    material: 'Acrylic (Transparent)4',
                //    quantity: 252,
                //    unitPrice: '$2.902',
                //    value: 1002,
                //    flg: 0
                //});
            }
        }
        //,
        //template: '<table id="setting" class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp is-upgraded" data-upgraded=",MaterialDataTable"><thead><tr><th><label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded" data-upgraded=",MaterialCheckbox,MaterialRipple"><input type="checkbox" class="mdl-checkbox__input"><span class="mdl-checkbox__focus-helper"></span><span class="mdl-checkbox__box-outline"><span class="mdl-checkbox__tick-outline"></span></span><span class="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple"><span class="mdl-ripple"></span></span></label></th><th class="mdl-data-table__cell--non-numeric">Material</th><th>Quantity</th><th>Unit price</th><th class="mdl-data-table__cell--non-numeric">value</th><th>on/off</th></tr></thead><tbody>' +
        //
        //'<tr v-repeat="mapInfo"><td><label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect mdl-data-table__select mdl-js-ripple-effect--ignore-events is-upgraded" data-upgraded=",MaterialCheckbox,MaterialRipple"><input type="checkbox" class="mdl-checkbox__input"><span class="mdl-checkbox__focus-helper"></span><span class="mdl-checkbox__box-outline"><span class="mdl-checkbox__tick-outline"></span></span><span class="mdl-checkbox__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple"><span class="mdl-ripple"></span></span></label></td><td class="mdl-data-table__cell--non-numeric">{{material}}</td><td>{{quantity}}</td><td>{{unitPrice}}</td><td><div class="mdl-slider__container"><input type="range" min="0" max="100" value="0" tabindex="0" class="mdl-slider mdl-js-slider is-lowest-value is-upgraded" data-upgraded=",MaterialSlider"><div class="mdl-slider__background-flex"><div class="mdl-slider__background-lower" style="flex: 0 1 0%;"></div><div class="mdl-slider__background-upper" style="flex: 1 1 0%;"></div></div></div></td><td><label for="switch-1{{$index}}" class="mdl-switch mdl-js-switch mdl-js-ripple-effect mdl-js-ripple-effect--ignore-events is-checked is-upgraded" data-upgraded=",MaterialSwitch,MaterialRipple"><input id="switch-1{{$index}}" type="checkbox" checked="" class="mdl-switch__input"><span class="mdl-switch__label"></span><div class="mdl-switch__track"></div><div class="mdl-switch__thumb"><span class="mdl-switch__focus-helper"></span></div><span class="mdl-switch__ripple-container mdl-js-ripple-effect mdl-ripple--center" data-upgraded=",MaterialRipple"><span class="mdl-ripple"></span></span></label></td></tr>' +
        //
        //'</tbody><tfoot><tr><td colspan="6"><button class="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" data-upgraded=",MaterialButton"><i class="material-icons">delete</i></button></td></tr></tfoot></table>'
    });

});


