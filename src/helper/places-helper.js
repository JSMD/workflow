const LogicError = require('../error').LogicError;

module.exports = {
  validatePlaces(type) {
    return (place) => {
      if (!this.places.has(place)) {
        const message = `Transition ${type} place "${place}" does not exists in referenced "${Array.from(this.places)}" places`;
        throw new LogicError(message);
      }
    };
  },
};
