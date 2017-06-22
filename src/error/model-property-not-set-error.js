class ModelPropertyNotSetError extends Error {
  constructor(model, property) {
    super(`Property ${property} from model ${model} not set!`);
  }
}

module.exports = ModelPropertyNotSetError;
