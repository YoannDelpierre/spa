'use strict';

// lib
var _ = require('underscore');
var View = require('./view');

// svc
var locSvc = require('lib/location');
var poiSvc = require('lib/places');

// username
var userName = require('lib/notifications');

// model/collection
var CheckInUx = require('models/check_in_ux');
var store = require('lib/persistance');

module.exports = View.extend({
    template: require('./templates/check_in'),
    poiTemplate: require('./templates/places'),
    subscriptions: {
        'connectivity:online': 'fetchPOI'
    },
    events: {
        // can use a class for example click header .btn-info
        'click header button': 'fetchPOI',
        'click #places li': 'selectPOI',
        'submit': 'checkIn'
    },
    bindings: {
        '#places': {
            observe: ['places', 'placeId'],
            updateMethod: 'html',
            onGet: function () {
                return this.getRenderData().placesList;
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
        },
        '#comment': 'comment',
        'header button': {
            attributes: [{
                name: 'disabled',
                observe: 'checkIsOnline'
            }]
        },
        'button[type=submit]': {
            attributes: [{
                name: 'disabled',
                observe: 'checkInForbidden'
            }]
        }
    },
    initialize: function () {
        View.prototype.initialize.apply(this, arguments);
        // associate model to CheckInUx
        this.model = new CheckInUx();
    },
    getRenderData: function () {
        return {
            placesList: this.renderTemplate(
                this.model.pick('places', 'placeId'),
                this.poiTemplate)
            // or
            // {
            //     places: this.model.get('places'),
            //     placeId: this.model.get('placeId')
            // }
            // , this.poiTemplate)

            // or use directly template declared

            // placesList: this.poiTemplate({
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
    checkIn: function(e) {
        // block submit
        e.preventDefault();

        // if true, return
        if(this.model.get('checkInForbidden')) {
            return;
        } else {
            var place = this.model.getPoi();
            var checkInPoi = _.extend({}, _.pick(
                place,
                'name', 'icon', 'vicinity'
            ), {
                placeId: place.id,
                userName: userName,
                comment: this.model.get('comment')
            });

            // reset model
            // this.model.set({
            //     placeId: this.model.defaults.placeId,
            //     comment: this.model.defaults.comment
            // });

            store.addCheckin(checkInPoi);

            // or
            this.model.set(_.pick(this.model.defaults, 'placeId', 'comment'));
        }
    },
    selectPOI: function (e) {
        var id = e.currentTarget.getAttribute('data-place-id');
        this.model.set('placeId', id);
    },
    fetchPOI: function () {
        // reset model
        this.model.set(this.model.defaults);

        // get coordinates and use them for POI
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
            });
        });
    }
});

function formatCoordinates(point) {
    return point.toFixed(4);
}