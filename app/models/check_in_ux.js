// Modèle : CheckInUx
// ================

'use strict';

var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
    defaults: {
        lat: 0,
        long: 0,
        placeId: null,
        places: [],
        comment: ''
    }
});
