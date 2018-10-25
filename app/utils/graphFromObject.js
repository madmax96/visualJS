import { BY_VALUE } from '../config';
/**
 *
 * @param {object} object
 * @param {array} V // All objects that appears in memory are vertices of graph
 * @param {array} prototypeEdges // Edges that represents prototype connection of 2 objects
 * @param {array} referenceEdges // Edges that represents reference connection of 2 objects
 *
 */

export default function createGraphFromObjects(objects, V = []) {
  const prototypeEdges = [];
  const referenceEdges = [];
  function traverseObject(object) {
    if (V.includes(object)) return;
    V.push(object);
    const prototype = Object.getPrototypeOf(object);
    if (prototype !== null) {
      prototypeEdges.push(new Map([[object, prototype]]));
      traverseObject(prototype);
    }
    const keys = Object.getOwnPropertyNames(object);
    keys.forEach((key) => {
      if (key === 'arguments' || key === 'callee' || key === 'caller') return; // these props are not accessible due to strict mode functions
      const value = object[key];
      if (!BY_VALUE.includes(typeof value) && value !== null) {
        const objectKeyMap = new Map([[object, key]]);
        referenceEdges.push(new Map([[objectKeyMap, value]]));
        traverseObject(value);
      }
    });
  }
  objects.forEach(object => traverseObject(object));

  return {
    V, prototypeEdges, referenceEdges,
  };
}
