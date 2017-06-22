class MultipleWorkflowsPerObjectError extends Error {
  constructor(model, workflows) {
    super(`Model ${model} should have a single workflow but present in ${workflows}`);
  }
}

module.exports = MultipleWorkflowsPerObjectError;
