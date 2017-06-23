/* global describe it */
const assert = require('chai').assert;

const Definition = require('../../src/module/definition');
const Transition = require('../../src/module/transition');
const error = require('../../src/error');

describe('Definition', () => {
  it('should be a Constructor with places, and transitions parameters', () => {
    const places = [];
    const transitions = [];
    const definition = new Definition(places, transitions);
    assert.instanceOf(definition, Definition);
    assert.deepEqual(definition.transitions, new Set(transitions));
    assert.deepEqual(definition.places, new Set(places));
  });

  describe('addPlace', () => {
    it('should be able to add a place', () => {
      const place = 'place';
      const definition = new Definition();
      definition.addPlace(place);
      assert.equal(definition.places.has(place), true);
    });

    it('should be able to add a place even when it exists one', () => {
      const places = ['place', 'place2'];
      const definition = new Definition();
      places.forEach(place => definition.addPlace(place));
      assert.equal(definition.places.has('place2'), true);
    });
  });

  describe('addTransition', () => {
    it('should be able to addTransition', () => {
      const places = ['created', 'draft', 'published'];
      const transition = new Transition('create', ['draft'], ['created']);
      const definition = new Definition(places);
      definition.addTransition(transition);

      assert.equal(definition.transitions.has(transition), true);
    });
    it('should throw InvalidInstanceError when transition is not of Transition type', () => {
      const transition = 'test';
      const places = ['created', 'draft', 'published'];

      try {
        const definition = new Definition(places);
        definition.addTransition(transition);
        assert.isTrue(false, 'Should throw InvalidInstanceError');
      } catch (err) {
        assert.instanceOf(err, error.InvalidInstanceError);
      }
    });
  });
});

