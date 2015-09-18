'use strict';

var _ = require('underscore');

// views
var View = require('./view');

// collection
var store = require('lib/persistance');

module.exports = View.extend({
  // Le template principal
  template: require('./templates/history'),
  checkinsTemplate: require('./templates/check_ins'),
  subscriptions: {
    'checkins:reset': 'render',
    'checkins:add': 'insertCheckIn'
  },
  insertCheckIn: function (checkIn) {
    checkIn.extra_class = 'new';

    this.$('#history').prepend(
        this.renderTemplate({
            checkIns: [checkIn]
        }, this.checkinsTemplate)
    );

    var self = this;

    _.defer(function () {
        self.$('#history li.new').removeClass('new');
    });
  },
  getRenderData: function () {
    return {
        list: this.renderTemplate({
            checkIns: store.getCheckins()
        }, this.checkinsTemplate)
    };
  }
});