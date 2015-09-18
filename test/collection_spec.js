'use strict';

var chai = require('chai');

describe('The collection', function() {
  var collection;

  before(function() {
    chai.should();
    global.navigator = {};
  });

  beforeEach(function() {
    var Collection = require('models/collection');
    collection = new Collection();
  });

  it('should maintain the natural order', function() {
    var oldCheckin = {
        key: Date.now() - 1000
    };
    var newCheckin = {
        key: Date.now()
    };

    collection.add(oldCheckin);
    collection.add(newCheckin);

    collection.at(0).toJSON().should.deep.equal(newCheckin);
    collection.at(1).toJSON().should.deep.equal(oldCheckin);
  });
});