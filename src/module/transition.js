class Transition {
  constructor(name, froms = [], tos = []) {
    this.name = name;
    this.froms = new Set(froms);
    this.tos = new Set(tos);
  }
}

module.exports = Transition;
