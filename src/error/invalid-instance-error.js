/**
 * @class InvalidInstanceError
 * @extends {Error}
 */
class InvalidInstanceError extends Error {
  constructor(object, instance) {
    super(`Invalid object "${object.constructor.name}" expected instance of "${instance.name}"`);
  }
}

module.exports = InvalidInstanceError;
