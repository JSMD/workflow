const EventEmitter = require('events').EventEmitter;

const Marking = require('../../src/module/marking');
const error = require('../error');
const eventDispatcher = require('../helper/event-dispatcher');

function doCan(subject, marking, transition) {
  // eslint-disable-next-line
  for (const place of transition.froms) {
    if (!marking.has(place)) {
      return false;
    }
  }

  if (eventDispatcher.guardTransition.call(this, subject, marking, transition) === true) {
    return false;
  }

  return true;
}

class Workflow extends EventEmitter {
  /**
   * @param {Definition} definition
   * @param {MarkingStore} markingStore
   * @param {String} name
   */
  constructor(definition, markingStore, name = 'unnamed') {
    super();
    this.definition = definition;
    this.markingStore = markingStore;
    this.name = name;
  }

  getMarking(subject) {
    const marking = this.markingStore.getMarking(subject);

    if (!(marking instanceof Marking)) {
      const message = `The value returned by the MarkingStore is not an instance of "Marking" for workflow "${this.name}"`;
      throw new error.LogicError(message);
    }

    if (!Object.keys(marking.places).length) {
      if (!this.definition.initialPlace) {
        const message = `The Marking is empty and there is no initial place for workflow "${this.name}"`;
        throw new error.LogicError(message);
      }
      marking.mark(this.definition.initialPlace);
      this.markingStore.setMarking(subject, marking);
    }

    const places = this.definition.places;

    if (!places.size) {
      const message = 'It seems you forgot to add places to the current workflow';
      throw new error.LogicError(message);
    }

    Object.keys(marking.places).forEach((placeName) => {
      if (!places.has(placeName)) {
        const message = `Place "${placeName}" is not valid for workflow "${this.name}"`;
        throw new error.LogicError(message);
      }
    });

    return marking;
  }

  getEnabledTransitions(subject) {
    const enabled = [];
    const marking = this.getMarking(subject);
    this.definition.transitions.forEach((transition) => {
      if (doCan.call(this, subject, marking, transition)) {
        enabled.push(transition);
      }
    });

    return enabled;
  }

  can(subject, transitionName) {

    return this.getEnabledTransitions(subject).some((transition) => {

      return (transition.name === transitionName);
    });
  }

  apply(subject, transitionName) {
    let applied = false;
    const transitions = this.getEnabledTransitions(subject);
    const marking = this.getMarking(subject);

    transitions.forEach((transition) => {
      if (transitionName === transition.name) {
        applied = true;

        eventDispatcher.dispatchLeave.call(this, subject, transition, marking);

        eventDispatcher.dispatchTransition.call(this, subject, transition, marking);

        eventDispatcher.dispatchEnter.call(this, subject, transition, marking);

        this.markingStore.setMarking(subject, marking);

        eventDispatcher.dispatchEntered.call(this, subject, transition, marking);

        eventDispatcher.dispatchAnnounce.call(this, subject, transition, marking);
      }
    });

    if (!applied) {
      const message = `Unable to apply transition "${transitionName}" for workflow "${this.name}"`;
      throw new error.LogicError(message);
    }
  }
}

module.exports = Workflow;
