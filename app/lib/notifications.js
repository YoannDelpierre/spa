'use strict';

var $ = require('jquery');
var _ = require('underscore');

var userName = sessionStorage.getItem('userName') ||
    $.trim(prompt('Tapez votre nom'));

// socket.io
var io = require('socket.io');
var store = require('lib/persistance');
var socket = io.connect();
socket.on('checkin', store.addCheckin)

if(userName) {
    sessionStorage.setItem('userName', userName);
} else {
    userName = 'Anonymous ' + _.random(0, 1000);
}

module.exports = userName;