'use strict';

var $ = require('jquery');
var _ = require('underscore');

var userName = sessionStorage.getItem('userName') ||
    $.trim(prompt('Tapez votre nom'));

if(userName) {
    sessionStorage.setItem('userName', userName);
} else {
    userName = 'Anonymous ' + _.random(0, 1000);
}

module.exports = userName;