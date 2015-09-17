// Modèle : CheckInUx
// ================

'use strict';

var _ = require('underscore');

var Backbone = require('backbone');

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

        // set checkInForbidden at model start
        checkCheckEnabled();
    },
    getPoi: function () {
        var id = this.get('placeId');
        return _.findWhere(this.get('places'), {
            id: id
        });
    }
});
