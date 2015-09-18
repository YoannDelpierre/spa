'use strict';

var Backbone = require('backbone');
var Lawnchair = require('lawnchair');
                require('lawnchair-dom');
var _ = require('underscore');

// models
var CheckInsCollection = require('models/collection');
var CheckIn = require('models/check_in');

// instance
var collection = new CheckInsCollection();
var localStore = new Lawnchair({
    name: 'checkins'
}, function () {});

// array pendings
var pendings = [];

// svc
var cnxSvc = require('lib/connectivity');

Backbone.Mediator.subscribe('connectivity:online', syncPending);

collection.on('reset', function () {
    localStore.nuke(function () {
        localStore.batch(collection.toJSON());
    });
    Backbone.Mediator.publish('checkins:reset');
});

collection.on('add', function (model) {
    localStore.save(model.toJSON());
    Backbone.Mediator.publish('checkins:add', model.toJSON());
});

collection.on('sync', function (model) {
  if (!(model instanceof CheckIn)) {
    return;
  }

  localStore.save(model.toJSON());
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
  pendings = collection.filter(function (c) { return c.isNew(); });
  if (pendings.length) {
    collection.on('sync', accountForSync);
    _.invoke(pendings, 'save');
  } else
    collection.fetch({ reset: true });
}

function getCheckins() {
    return collection.toJSON();
}

function initialLoad() {
  localStore.all(function (checkins) {
    collection.reset(checkins);
    syncPending();
  });
}

function getCheckIn(id) {
  return collection.get(id);
}

function addCheckin(checkIn) {
  // if (collection.findWhere(_.pick(checkIn, 'key', 'userName'))) {
  //   return;
  // }

  checkIn.key = checkIn.key || Date.now();
  collection['id' in checkIn ? 'add' : 'create'](checkIn);
}

initialLoad();

module.exports = {
    addCheckin: addCheckin,
    getCheckins: getCheckins,
    getCheckIn: getCheckIn
};