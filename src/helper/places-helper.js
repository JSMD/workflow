const util = require('util');

const LogicError = require('../error').LogicError;

module.exports = {
  validatePlaces(type) {
    return (place) => {
      if (!this.places.has(place)) {
        throw new LogicError(
          util.format(
            'Transition %s place "%s" does not exists in referenced "%s" places',
            type,
            place,
            Array.from(this.places),
          ));
      }
    };
  },
};
