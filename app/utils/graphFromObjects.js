import { isValidProp, isReferenceType } from './validation';
/**
 *
 * @param {array} objects
 * @param {array} alreadyVisualised // internals that are already in memory
 *
 */

export default function createGraphFromObjects(objects, alreadyVisualised) {
  const prototypeEdges = [];
  const referenceEdges = [];
  const V = [];
  function traverseObject(object) {
    const symbols = Object.getOwnPropertySymbols(object);

    if (V.includes(object) || (alreadyVisualised && alreadyVisualised.includes(object))) {
      const counterSymbol = symbols[symbols.length - 1];
      object[counterSymbol]++;
      return;
    }


    let hasCounterSymbol = false;
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      if (symbol.toString() === 'Symbol(numOfReferences)') {
        hasCounterSymbol = true;
        break;
      }
    }
    if (!hasCounterSymbol) {
      /*
      The following mutation on object is used
      to track how many references specific object has toward it
      This will be used for drawing purposes so that objects with more references appear above

      Symbol properties are not enumerable and can be used to add 'hidden' properties on objects
    */
      object[Symbol('numOfReferences')] = 1;
    }

    V.push(object);
    const prototype = Object.getPrototypeOf(object);
    if (prototype !== null) {
      prototypeEdges.push(new Map([[object, prototype]]));
      traverseObject(prototype);
    }

    const keys = Object.getOwnPropertyNames(object);
    keys.forEach((key) => {
      if (!isValidProp(key)) return;
      let value;
      try {
        value = object[key]; // vidi za size na Set objektu
      } catch (e) {
        return;
      }
      if (isReferenceType(value)) {
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
