/* global describe it */

const assert = require('chai').assert;

const SingleStateMarkingStore = require('../../../src/module/marking-store').SingleStateMarkingStore;
const Marking = require('../../../').Marking;

describe('SingleStateMarkingStore', () => {
  it('should be a constructor with propperty parameter', () => {
    const markingStore = new SingleStateMarkingStore();

    assert.instanceOf(markingStore, SingleStateMarkingStore);
    assert.equal(markingStore.property, 'marking');
  });
  class User { constructor() { this.state = 'default'; } }

  describe('getMarking', () => {
    it('should be able to return a marking instance when the property is set', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const marking = markingStore.getMarking(new User());

      assert.instanceOf(marking, Marking);
      assert.deepEqual(marking.places, { default: 1 });
    });
    it('should be able to return an empty marking when property is not set', () => {
      const markingStore = new SingleStateMarkingStore();
      const marking = markingStore.getMarking(new User());

      assert.instanceOf(marking, Marking);
      assert.deepEqual(marking.places, {});
    });
  });

  describe('setMarking', () => {
    it('should set the marking value', () => {
      const markingStore = new SingleStateMarkingStore('state');
      const marking = new Marking(['draft']);
      const user = new User();

      markingStore.setMarking(user, marking);
      assert.equal(user.state, 'draft');
    });
  });
});
