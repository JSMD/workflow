const Transition = require('./transition');
const validatePlaces = require('../helper/places-helper').validatePlaces;
const InvalidInstanceError = require('../error').InvalidInstanceError;

/**
 * @class Definition
 */
class Definition {
  /**
   * Creates an instance of Definition.
   * @param {Array} [places=[]]
   * @param {Transition[]} [transitions=[]]
   * @param {String} [initialPlace=null]
   * @param {Marking} [marking=null]
   * @memberof Definition
   */
  constructor(
    places = [],
    transitions = [],
    initialPlace = null,
    marking = null,
  ) {
    this.places = new Set(places);
    this.transitions = new Set(transitions);
    this.initialPlace = initialPlace;
    this.marking = marking;
  }

  /**
   * @param {string} place
   * @memberof Definition
   */
  addPlace(place) {
    if (!this.places.size) {
      this.initialPlace = place;
    }
    this.places.add(place);
  }

  /**
   * @param {Transition} transition
   * @memberof Definition
   */
  addTransition(transition) {
    if (transition instanceof Transition) {
      transition.froms.forEach(validatePlaces.bind(this)('from'));
      transition.tos.forEach(validatePlaces.bind(this)('to'));

      this.transitions.add(transition);
    } else {
      throw new InvalidInstanceError(transition, Transition);
    }
  }
}

module.exports = Definition;
