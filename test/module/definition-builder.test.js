/* global describe it */
const assert = require('chai').assert;

const DefinitionBuilder = require('../../src/module/definition-builder');
const InvalidInstanceError = require('../../src/error').InvalidInstanceError;
const LogicError = require('../../src/error').LogicError;
const Transition = require('../../src/module/transition');
const Definition = require('../../src/module/definition');

describe('DefinitionBuilder', () => {
  it('should exist the DefinitionBuilder constructor with places and transitions', () => {
    const places = [];
    const transitions = [];
    const definitionBuilder = new DefinitionBuilder(places, transitions);

    assert.instanceOf(definitionBuilder, DefinitionBuilder);
  });

  describe('reset', () => {
    it('should have the reset method that resets the definition', () => {
      const definitionBuilder = new DefinitionBuilder(['place1', 'place2'], ['transition1']);

      assert.deepEqual(definitionBuilder.reset().places, new Set());
      assert.deepEqual(definitionBuilder.reset().transitions, new Set());
    });
  });

  describe('addPlace', () => {
    it('should add initial place when you add a place for the first time', () => {
      const definitionBuilder = new DefinitionBuilder();
      const place = 'place1';

      assert.equal(definitionBuilder.addPlace(place).initialPlace, place);
    });
  });

  describe('addTransition', () => {
    it('should throw InvalidInstanceError when trying to add a non Transition', () => {
      const transition = [];
      try {
        const definitionBuilder = new DefinitionBuilder();
        definitionBuilder.addTransition(transition);
      } catch (error) {
        assert.instanceOf(error, InvalidInstanceError);
      }
    });

    it('should throw a LogicError if the transition froms and tos does not exists in the places', () => {
      const transition = new Transition('cancel');
      const places = ['published', 'canceled'];

      transition.froms.add('drafted');
      transition.tos.add('canceled');

      const definitionBuilder = new DefinitionBuilder();
      try {
        definitionBuilder
          .addPlaces(places)
          .addTransition(transition);
        assert.isTrue(false, `Should throw ${LogicError.name}`);
      } catch (error) {
        assert.instanceOf(error, LogicError);
      }
    });

    it('should add a valid transition', () => {
      const transition = new Transition();
      const definitionBuilder = new DefinitionBuilder();

      definitionBuilder.addTransition(transition);
      assert.isTrue(definitionBuilder.transitions.has(transition));
    });
  });

  describe('addTransitions', () => {
    it('should add an array of transitions', () => {
      const transitions = [new Transition(), new Transition(), new Transition()];
      const definitionBuilder = new DefinitionBuilder();

      definitionBuilder.addTransitions(transitions);

      assert.equal(definitionBuilder.transitions.size, 3);
    });
  });

  describe('addPlaces', () => {
    it('should add an array of places', () => {
      const places = ['place1', 'place2', 'place3'];
      const definitionBuilder = new DefinitionBuilder();

      definitionBuilder.addPlaces(places);

      assert.equal(definitionBuilder.places.size, 3);
    });
  });

  describe('build', () => {
    it('should build a new definition', () => {
      const transition = new Transition();
      transition.froms = new Set(['one', 'two']);
      transition.tos = new Set(['two']);

      const definitionBuilder = new DefinitionBuilder();
      const definition = definitionBuilder
        .addPlace('one')
        .addPlace('two')
        .addTransition(transition)
        .build();

      assert.instanceOf(definition, Definition);
    });
  });
});
