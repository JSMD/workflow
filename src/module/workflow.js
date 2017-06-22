const EventEmitter = require('events').EventEmitter;
const ModelNotSupportedError = require('../error').ModelNotSupportedError;
const ModelPropertyNotSetError = require('../error').ModelPropertyNotSetError;
const MultipleworkflowsPerObjectError = require('../error').MultipleWorkflowsPerObjectError;
const ModelApplyError = require('../error').ModelApplyError;
const util = require('util');

// const Config = require('./config');
/**
 * Todo need a way to add states, and transitions with a config
 * also to be able to emit events on state change and then the posibility
 * to validate each transition without aply the change.
 * Should inspire from symfony 3 workflow.
 */

const setObjectStateValue = (object, propertyName, value) => {
  object[propertyName] = value;
};

const getObjectStateValue = (object, propertyName) => {
  if (object[propertyName] === undefined) {
    throw new ModelPropertyNotSetError(object.constructor.modelName, propertyName);
  }

  return object[propertyName];
};

const filterEnabledTransitions = (transitions, currentState) =>
  Object.keys(transitions)
    .filter(transition => transitions[transition].from.includes(currentState));

const leave = (subject, transition) => {
  this.emit('workflow.leave', subject);
  this.emit(util.format('workflow.%s.leave', transition), subject);
};

const getObjectWorkflow = (object, workflows) => {
  const objtWorkflows = [];

  Object.keys(workflows).forEach((keyWorkflow) => {
    const workflow = workflows[keyWorkflow];
    if (workflow.supports.includes(object.constructor.modelName)) {
      objtWorkflows.push(workflow);
    }
  });

  if (objtWorkflows.length > 1) {
    throw new MultipleworkflowsPerObjectError(object.constructor.modelName);
  } else if (objtWorkflows.length === 0) {
    throw new ModelNotSupportedError(object.constructor.modelName);
  }
  return objtWorkflows.pop();
};

class Workflow extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  getEnabledTransition(object) {
    const workflow = getObjectWorkflow(object, this.options.workflows);
    const objectStateValue = getObjectStateValue(object, workflow.property);

    return filterEnabledTransitions(workflow.transitions, objectStateValue);
  }

  can(object, transition) {
    const transitions = this.getEnabledTransition(object);

    return transitions.includes(transition);
  }

  apply(object, transition) {
    if (!this.can(object, transition)) {
      throw new ModelApplyError(object.constructor.modelName, transition);
    }

    leave(object, transition);
  }
}

module.exports = Workflow;
