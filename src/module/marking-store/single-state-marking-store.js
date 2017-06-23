const Marking = require('../marking');
const MarkingStore = require('./marking-store');

class SingleStateMarkingStore extends MarkingStore {
  getMarking(subject) {
    const placename = subject[this.property];
    if (!placename) {
      return new Marking();
    }

    return new Marking([placename]);
  }

  setMarking(subject, marking) {
    subject[this.property] = Object.keys(marking.places).pop();
  }
}

module.exports = SingleStateMarkingStore;
