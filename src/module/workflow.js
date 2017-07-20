const EventEmitter = require('events').EventEmitter;

const Marking = require('../../src/module/marking');
const error = require('../error');
const event = require('./event');

function guardTransition(subject, marking, transition) {
  const guardEvent = new event.GuardEvent();

  this.emit('workflow.guard', guardEvent);
  this.emit(`workflow.${this.name}.guard`, guardEvent);
  this.emit(`workflow.${this.name}.guard.${transition.name}`, guardEvent);

  return guardEvent.isBlocked();
}

function doCan(subject, marking, transition) {
  // eslint-disable-next-line
  for (const place of transition.froms) {
    if (!marking.has(place)) {
      return false;
    }
  }

  if (guardTransition.call(this, subject, marking, transition) === true) {
    return false;
  }

  return true;
}

function dispatchLeave(subject, transition, marking) {
  const places = transition.froms;
  const workflowEvent = new event.Event(subject, marking, transition, this.name);

  this.emit('workflow.leave', workflowEvent);
  this.emit(`workflow.${this.name}.leave`, workflowEvent);

  places.forEach((place) => {
    this.emit(`workflow.${this.name}.leave.${place}`, workflowEvent);

    marking.unmark(place);
  });
}

function dispatchTransition(subject, transition, marking) {
  const workflowEvent = new event.Event(subject, marking, transition, this.name);

  this.emit('workflow.transition', workflowEvent);
  this.emit(`workflow.${this.name}.transition`, workflowEvent);
  this.emit(`workflow.${this.name}.transition.${transition.name}`, workflowEvent);
}

function dispatchEnter(subject, transition, marking) {
  const places = transition.tos;
  const workflowEvent = new event.Event(subject, marking, transition, this.name);

  this.emit('workflow.enter', workflowEvent);
  this.emit(`workflow.${this.name}.enter`, workflowEvent);

  places.forEach((place) => {
    this.emit(`workflow.${this.name}.enter.${place}`, workflowEvent);

    marking.mark(place);
  });
}

function dispatchEntered(subject, transition, marking) {
  const workflowEvent = new event.Event(subject, marking, transition, this.name);

  this.emit('workflow.entered', workflowEvent);
  this.emit(`workflow.${this.name}.entered`, workflowEvent);

  transition.tos.forEach((place) => {
    this.emit(`workflow.${this.name}.entered.${place}`, workflowEvent);
  });
}

function dispatchAnnounce(subject, initialTransition, marking) {
  const workflowEvent = new event.Event(subject, marking, initialTransition, this.name);

  this.getEnabledTransitions(subject).forEach((transition) => {
    this.emit(`workflow.${this.name}.announce.${transition.name}`, workflowEvent);
  });
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
    let canTransit = false;
    const transitions = this.getEnabledTransitions(subject);

    transitions.forEach((transition) => {
      if (transition.name === transitionName) {
        canTransit = true;
      }
    });

    return canTransit;
  }

  apply(subject, transitionName) {
    let applied = false;
    const transitions = this.getEnabledTransitions(subject);
    const marking = this.getMarking(subject);

    transitions.forEach((transition) => {
      if (transitionName === transition.name) {
        applied = true;

        dispatchLeave.call(this, subject, transition, marking);

        dispatchTransition.call(this, subject, transition, marking);

        dispatchEnter.call(this, subject, transition, marking);

        this.markingStore.setMarking(subject, marking);

        dispatchEntered.call(this, subject, transition, marking);

        dispatchAnnounce.call(this, subject, transition, marking);
      }
    });

    if (!applied) {
      const message = `Unable to apply transition "${transitionName}" for workflow "${this.name}"`;
      throw new error.LogicError(message);
    }
  }
}

module.exports = Workflow;
