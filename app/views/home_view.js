// Contrôleur principal
// ====================

'use strict';

var $ = require('jquery');
var moment = require('moment');

// views
var View = require('./view');
var CheckInView = require('./checkin_view');
var HistoryView = require('./history_view');

// svc
var cnxSvc = require('lib/connectivity');

// vars
var userName = require('lib/notifications');
var dateFormat = 'DD/MM/YYYY HH:mm:ss';

module.exports = View.extend({
  // Le template principal
  template: require('./templates/home'),
  subscriptions: {
    'connectivity:online': 'syncStatus',
    'connectivity:offline': 'syncStatus'
  },
  afterRender: function () {
    // call startClock
    this.startClock();
    // call checkinview
    this.checkInView();
    // call history view
    this.historyView();
    // call syncStatus
    this.syncStatus();
  },
  getRenderData: function () {
    return {
        userName: userName,
        now: moment().format(dateFormat)
    };
  },
  syncStatus : function () {
    this.onlineMarker = this.onlineMarker || this.$('#onlineMarker');
    this.onlineMarker[cnxSvc.isOnline() ? 'show' : 'hide']('fast');
  },
  startClock: function () {
    this.clock = this.clock || this.$('#ticker');
    var self = this;

    setInterval(function () {
        self.clock.text(self.getRenderData().now);
    }, 1000);
  },
  checkInView: function () {
    new CheckInView({
      el: this.$('#checkInUI')
    }).render();
  },
  historyView: function () {
    new HistoryView({
      el: this.$('#historyUI')
    }).render();
  }
});