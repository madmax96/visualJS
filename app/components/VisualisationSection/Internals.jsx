import React from 'react';

const JS_INTERNALS_TO_VISUALISE = ['Function', 'Object', 'Array'];

const BY_VALUE = ['string', 'number', 'symbol', 'undefined', 'boolean'];

const V = []; // All objects that appears in memory
const prototypeEdges = []; // maping from object to it's prototype
const referenceEdges = []; // mapping from object property to some other reference value
/**
 *
 * @param {object} toVisualise
 */

function createGraphFromObject(toVisualise) {
  if (V.includes(toVisualise)) return;
  V.push(toVisualise);
  const prototype = Object.getPrototypeOf(toVisualise);
  if (prototype !== null) {
    prototypeEdges.push(new Map([[toVisualise, prototype]]));
    createGraphFromObject(prototype);
  }
  const keys = Object.getOwnPropertyNames(toVisualise);
  keys.forEach((key) => {
    if (key === 'arguments' || key === 'callee' || key === 'caller') return;
    const value = toVisualise[key];
    if (!BY_VALUE.includes(typeof value) && value !== null) {
      const objectKeyMap = new Map([[toVisualise, key]]);
      referenceEdges.push(new Map([[objectKeyMap, value]]));
      createGraphFromObject(value);
    }
  });
}
// const testVisualise = ['name', 'surname', 'country'];
const host = {
  name() {},
  surname: { value: 'simonovic' },
  country: {
    continent: 'Europe',
    name: { official: 'Serbia', american: 'siria' },
  },
};

createGraphFromObject(host);

console.log(V);
console.log(prototypeEdges);
console.log(referenceEdges);
export default props => (
  <div>asa</div>
);
