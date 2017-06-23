const Event = require('./event');

/**
 * @class GuardEvent
 */
class GuardEvent extends Event {
  constructor() {
    super();
    this.blocked = false;
  }

  /**
   * @returns {Boolean}
   * @memberof GuardEvent
   */
  isBlocked() {
    return this.blocked;
  }
}

module.exports = GuardEvent;
