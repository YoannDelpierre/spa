'use strict';

var Backbone = require('backbone');
var _ = require('underscore');

var CheckInsCollection = require('models/collection');
var collection = new CheckInsCollection();

var pendings = [];

// svc
var cnxSvc = require('lib/connectivity');

Backbone.Mediator.subscribe('connectivity:online', syncPending);

collection.on('reset', function() {
    Backbone.Mediator.publish('checkins:reset');
});

collection.on('add', function(model) {
    Backbone.Mediator.publish('checkins:add', model.toJSON());
});

function accountForSync(model) {
  pendings = _.without(pendings, model);
  if (pendings.length) return;

  collection.off('sync', accountForSync);
  collection.fetch({ reset: true });
}

function syncPending() {
  if (!cnxSvc.isOnline()) return;

  collection.off('sync', accountForSync);
  pendings = collection.filter(function(c) { return c.isNew(); });
  if (pendings.length) {
    collection.on('sync', accountForSync);
    _.invoke(pendings, 'save');
  } else
    collection.fetch({ reset: true });
}

function addCheckin(checkIn) {
    checkIn.stamp = checkIn.stamp || Date.now();
    collection ['id' in checkIn ? 'add' : 'create'](checkIn);
}

function getCheckins() {
    return collection.toJSON();
}

syncPending();

module.exports = {
    addCheckin: addCheckin,
    getCheckins: getCheckins
};