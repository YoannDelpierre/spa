'use strict';

// lib
var _ = require('underscore');
var View = require('./view');

// svc
var locSvc = require('lib/location');
var poiSvc = require('lib/places');

// models
var CheckInUx = require('models/check_in_ux');

module.exports = View.extend({
    template: require('./templates/check_in'),
    poiTemplate: require('./templates/places'),
    events: {
        // can use a class for example click header .btn-info
        'click header button': 'fetchPOI',
        'click #places li': 'selectPOI'
    },
    bindings: {
        '#places': {
            observe: ['places', 'placeId'],
            updateMethod: 'html',
            onGet: function () {
                return this.getRenderData().placeList;
            }
        },
        '#geoloc': {
            observe: ['lat', 'long'],
            onGet: function(pos) {
                if(pos[0] && pos[1]) {
                    return 'Je suis ici : ' + formatCoordinates(pos[0]) + ' - ' + formatCoordinates(pos[1]);
                }
                return 'Geolocalisation en cours';
            }
        }
    },
    initialize: function () {
        View.prototype.initialize.apply(this, arguments);
        // associate model to CheckInUx
        this.model = new CheckInUx();
    },
    getRenderData: function () {
        return {
            placeList: this.renderTemplate({
                places: this.model.get('places')
            }, this.poiTemplate)

            // or use directly template declared

            // placeList: this.poiTemplate({
            //     places: this.model.get('places')
            // }, {
            //     secondesToMinutes: function () {
            //         return 0;
            //     }
            // })
        };
    },
    afterRender: function () {
        /// call fetchPOI
        this.fetchPOI();
    },
    fetchPOI: function () {
        var self = this;
        locSvc.getCurrentLocation(function(lat, long) {
            if(!_.isNumber(lat) || !_.isNumber(long)) {
                return;
            }

            self.model.set({
                lat: lat,
                long: long
            });

            poiSvc.lookupPlaces(lat, long, function(poi) {
                self.model.set('places', poi);

                //setTimeout(self.render.bind(self), 1000);
            });
        });
    }
});

function formatCoordinates(point) {
    return point.toFixed(4);
}