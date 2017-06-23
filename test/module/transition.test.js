/* global describe it */
const assert = require('chai').assert;

const Transition = require('../../src/module/transition');

describe('Transition', () => {
  it('should exist the Transition constructor and have froms and tos', () => {
    const froms = ['publish', 'start'];
    const tos = ['delete', 'end'];
    const name = 'transition-name';

    const transition = new Transition('transition-name', froms, tos);
    assert.deepEqual(transition.froms, new Set(froms));
    assert.deepEqual(transition.tos, new Set(tos));
    assert.equal(transition.name, name);
  });
});
