// Modèle : CheckInUx
// ================

'use strict';

var _ = require('underscore');

var Backbone = require('backbone');

// svc
var cnxSvc = require('lib/connectivity');

module.exports = Backbone.Model.extend({
    defaults: {
        lat: 0,
        long: 0,
        placeId: null,
        places: [],
        comment: ''
    },
    initialize: function () {
        var self = this;

        // on change = model has changed
        this.on('change', checkCheckEnabled);

        function checkCheckEnabled () {
            self.set('checkInForbidden', self.get('placeId') === null);
        }

        function checkIsOnline () {
            self.set('checkIsOnline', !cnxSvc.isOnline());
        }

        // set data on model
        checkCheckEnabled();
        checkIsOnline();

        // subscribe
        Backbone.Mediator.subscribe('connectivity:online', checkIsOnline);
        Backbone.Mediator.subscribe('connectivity:offline', checkIsOnline);
    },
    getPoi: function () {
        var id = this.get('placeId');
        return _.findWhere(this.get('places'), {
            id: id
        });
    }
});
