/**
 * @class Event
 */
class Event {
  /**
   * @param {Object} subject
   * @param {Marking} marking
   * @param {Transition} transition
   * @param {String} workflowName [ workflowName = 'unnamed']
   */
  constructor(subject, marking, transition, workflowName = 'unnamed') {
    this.subject = subject;
    this.marking = marking;
    this.transition = transition;
    this.workflowName = workflowName;
  }
}

module.exports = Event;
