// Modèle : CheckIn
// ================

'use strict';

var Backbone = require('backbone');

// svc
var cnxSvc = require('lib/connectivity');

// Bon, on n'a *rien* à rajouter aux capacités inhérentes
// de Backbone.Model, mais c'est toujours mieux de prévoir un
// module par modèle et par collection, donc voilà.

module.exports = Backbone.Model.extend({
    sync: function (method, model, options) {
        if(!cnxSvc.isOnline()) {
            return;
        }
        return Backbone.sync(method, model, options);
    }
});
