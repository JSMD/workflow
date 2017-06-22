class ModelNotSupporedError extends Error {
  constructor(model) {
    super(`Model ${model} not supported!`);
  }
}

module.exports = ModelNotSupporedError;
