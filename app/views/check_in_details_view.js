'use strict';

var View = require('./view');
var $ = require('jquery');

var CheckInDetailsView = View.extend({
  className: 'modal fade',
  id: 'checkInDetails',
  // événement bootstrap
  events: { 'hidden.bs.modal': 'wrapUp' },
  template: require('./templates/check_in_details'),
  wrapUp: function wrapUp() {
    // …
  }
}, { // Méthodes « statiques »
  cancel: function () {}, // navigation vers '/'
  display: function (model) {
    singleton.model = model;
    singleton.render();

    $('body').append(singleton.el);

    singleton.$el.modal('show');
  }
});

var singleton = new CheckInDetailsView();

module.exports = CheckInDetailsView;