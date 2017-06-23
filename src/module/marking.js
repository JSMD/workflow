class Marking {
  constructor(representations = []) {
    this.places = {};
    if (representations instanceof Array) {
      representations.forEach(representation => this.mark(representation));
    }
  }

  mark(place) {
    this.places[place] = 1;
  }

  unmark(place) {
    delete this.places[place];
  }

  has(place) {
    return Object.keys(this.places).includes(place);
  }
}

module.exports = Marking;
