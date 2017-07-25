const event = require('../module/event');

module.exports = {
  dispatchLeave(subject, transition, marking) {
    const places = transition.froms;
    const workflowEvent = new event.Event(subject, marking, transition, this.name);

    this.emit('workflow.leave', workflowEvent);
    this.emit(`workflow.${this.name}.leave`, workflowEvent);

    places.forEach((place) => {
      this.emit(`workflow.${this.name}.leave.${place}`, workflowEvent);

      marking.unmark(place);
    });
  },

  dispatchTransition(subject, transition, marking) {
    const workflowEvent = new event.Event(subject, marking, transition, this.name);

    this.emit('workflow.transition', workflowEvent);
    this.emit(`workflow.${this.name}.transition`, workflowEvent);
    this.emit(`workflow.${this.name}.transition.${transition.name}`, workflowEvent);
  },

  dispatchEnter(subject, transition, marking) {
    const places = transition.tos;
    const workflowEvent = new event.Event(subject, marking, transition, this.name);

    this.emit('workflow.enter', workflowEvent);
    this.emit(`workflow.${this.name}.enter`, workflowEvent);

    places.forEach((place) => {
      this.emit(`workflow.${this.name}.enter.${place}`, workflowEvent);

      marking.mark(place);
    });
  },

  dispatchEntered(subject, transition, marking) {
    const workflowEvent = new event.Event(subject, marking, transition, this.name);

    this.emit('workflow.entered', workflowEvent);
    this.emit(`workflow.${this.name}.entered`, workflowEvent);

    transition.tos.forEach((place) => {
      this.emit(`workflow.${this.name}.entered.${place}`, workflowEvent);
    });
  },

  dispatchAnnounce(subject, initialTransition, marking) {
    const workflowEvent = new event.Event(subject, marking, initialTransition, this.name);

    this.getEnabledTransitions(subject).forEach((transition) => {
      this.emit(`workflow.${this.name}.announce.${transition.name}`, workflowEvent);
    });
  },

  guardTransition(subject, marking, transition) {
    const guardEvent = new event.GuardEvent();

    this.emit('workflow.guard', guardEvent);
    this.emit(`workflow.${this.name}.guard`, guardEvent);
    this.emit(`workflow.${this.name}.guard.${transition.name}`, guardEvent);

    return guardEvent.isBlocked();
  },
};
