'use strict';

var CheckInsCollection = require('models/collection');
var collection = new CheckInsCollection();

function addCheckin(checkIn) {
    checkIn.stamp = checkIn.stamp || Date.now();
    collection.create(checkIn);
}

module.exports = {
    addCheckin: addCheckin
};