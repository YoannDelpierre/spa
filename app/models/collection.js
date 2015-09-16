// Collection : Check-Ins
// ======================

'use strict';

var Backbone = require('backbone');

// Définition de la collection qu'on va employer (collection
// Backbone de check-ins).  On exploite ici plusieurs aspects
// pratiques des collections Backbone.

module.exports = Backbone.Collection.extend({
  // Définition du modèle à exploiter lors d'ajouts, fetches, etc.
  // Du coup, on peut passer juste des hashes d'attributs, ça
  // convertit tout seul.
  model: require('./check_in')
});
