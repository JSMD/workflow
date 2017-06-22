class ModelApplyError extends Error {
  constructor(model, transition) {
    super(`Cannot apply transition "${transition}" to model "${model}"`);
  }
}

module.exports = ModelApplyError;
