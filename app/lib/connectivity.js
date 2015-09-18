// Détection online/offline
// ========================

'use strict';

var Backbone = require('backbone');
var $ = require('jquery');

// Ce module encapsule la gestion de la connectivité
// (états online/offline du navigateur) à destination des
// divers éléments externes (notamment la couche de persistence
// et les exploitations d'API externes type Google Maps / Places).

// On publie une seule méthode : isOnline.  Indique le bon état en
// live sur à peu près tous les browsers modernes.

exports.isOnline = function () {
    return true;
};

// override if navigator is available
if('onLine' in navigator) {
    exports.isOnline = function () {
        return navigator.onLine;
    };

    $(window).on('online offline', dispatchStatus);

    dispatchStatus();
}

function dispatchStatus() {
    Backbone.Mediator.publish(exports.isOnline() ? 'connectivity:online' : 'connectivity:offline');
}