/* global describe it */
const assert = require('chai').assert;

const Marking = require('../../src/module/marking');

describe('Marking', () => {
  it('should be a constructor with representations parameter', () => {
    const marking = new Marking(['deleted']);
    assert.instanceOf(marking, Marking);
    assert.isTrue(marking.places.deleted === 1);
  });

  it('should do nothing when sending other stuff than array in constructor', () => {
    const marking = new Marking('string');
    assert.deepEqual(marking.places, {});
  });

  describe('mark', () => {
    it('should be able to mark a place', () => {
      const marking = new Marking();
      marking.mark('deleted');
      assert.isTrue(marking.places.deleted === 1);
    });
  });
  describe('unmark', () => {
    it('should be able to unmark a place', () => {
      const marking = new Marking(['deleted']);
      marking.unmark('deleted');
      assert.isFalse(Object.prototype.hasOwnProperty.call(marking.places, 'deleted'));
    });

    it('should unmark a place that does not exist', () => {
      const marking = new Marking([]);
      assert.isFalse(Object.prototype.hasOwnProperty.call(marking.places, 'deleted'));
    });
  });
  describe('has', () => {
    it('should be able to check if a marking has a specific place', () => {
      const marking = new Marking(['deleted']);
      assert.isTrue(marking.has('deleted'));
    });

    it('should be able to return false if a marking is not set', () => {
      const marking = new Marking(['deleted']);
      assert.isFalse(marking.has('draft'));
    });
  });
});
