// Contrôleur principal
// ====================

'use strict';

var $ = require('jquery');
var moment = require('moment');

// views
var View = require('./view');
var CheckInView = require('./checkin_view');

// vars
var userName = require('lib/notifications');
var dateFormat = 'DD/MM/YYYY HH:mm:ss';

module.exports = View.extend({
  // Le template principal
  template: require('./templates/home'),
  afterRender: function () {
    // call startClock
    this.startClock();
    // call checkinview
    this.checkInView();
  },
  getRenderData: function () {
    return {
        userName: userName,
        now: moment().format(dateFormat)
    };
  },
  startClock: function() {
    this.clock = this.clock || this.$('#ticker');
    var self = this;

    setInterval(function() {
        self.clock.text(self.getRenderData().now);
    }, 1000);
  },
  checkInView: function () {
    new CheckInView({
      el: this.$('#checkInUI')
    }).render();
  }
});