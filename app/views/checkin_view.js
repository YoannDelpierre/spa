'use strict';

var _ = require('underscore');

var View = require('./view');

var locSvc = require('lib/location');
var poiSvc = require('lib/places');

module.exports = View.extend({
    template: require('./templates/check_in'),
    getRenderData: function () {

    },
    afterRender: function () {
        /// call fetchPOI
        this.fetchPOI();
    },
    fetchPOI: function () {
        locSvc.getCurrentLocation(function(lat, long) {
            if(!_.isNumber(lat) || !_.isNumber(long)) {
                return;
            }

            poiSvc.lookupPlaces(lat, long, function(poi) {
                return poi;
            });
        });
    }
});