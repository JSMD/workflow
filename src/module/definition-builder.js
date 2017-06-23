const Transition = require('./transition');
const InvalidInstanceError = require('../error').InvalidInstanceError;
const Definition = require('./definition');
const validatePlaces = require('../helper/places-helper').validatePlaces;

/**
 * @class DefinitionBuilder
 */
class DefinitionBuilder {
  /**
   * Creates an instance of DefinitionBuilder.
   * @param {Array} [places=[]]
   * @param {Transition[]} [transitions=[]]
   * @param {Marking} marking
   * @memberof DefinitionBuilder
   */
  constructor(places = [], transitions = [], marking = null) {
    this.places = new Set(places);
    this.transitions = new Set(transitions);
    this.marking = marking;
  }

  /**
   * @returns {DefinitionBuilder}
   * @memberof DefinitionBuilder
   */
  reset() {
    this.places.clear();
    this.transitions.clear();
    this.initialPlace = null;
    this.marking = null;

    return this;
  }

  /**
   * @param {string} place
   * @returns {DefinitionBuilder}
   * @memberof DefinitionBuilder
   */
  addPlace(place) {
    if (!this.places.size) {
      this.initialPlace = place;
    }
    this.places.add(place);

    return this;
  }

  /**
   * @param {Transition} transition
   * @returns {DefinitionBuilder}
   * @memberof DefinitionBuilder
   */
  addTransition(transition) {
    if (transition instanceof Transition) {
      transition.froms.forEach(validatePlaces.bind(this)('from'));
      transition.tos.forEach(validatePlaces.bind(this)('to'));

      this.transitions.add(transition);
    } else {
      throw new InvalidInstanceError(transition, Transition);
    }

    return this;
  }

  /**
   * @param {Transition[]} transitions
   * @returns {DefinitionBuilder}
   * @memberof DefinitionBuilder
   */
  addTransitions(transitions) {
    transitions.forEach(transition => this.addTransition(transition));

    return this;
  }

  /**
   * @param {array} places
   * @returns {DefinitionBuilder}
   * @memberof DefinitionBuilder
   */
  addPlaces(places) {
    places.forEach(place => this.addPlace(place));

    return this;
  }

  /**
   * @param {Marking} marking
   * @memberof DefinitionBuilder
   */
  setMarking(marking) {
    this.marking = marking;

    return this;
  }

  /**
   * @returns {Definition}
   * @memberof DefinitionBuilder
   */
  build() {
    return new Definition(
      this.places,
      this.transitions,
      this.initialPlace,
      this.marking,
    );
  }
}

module.exports = DefinitionBuilder;
