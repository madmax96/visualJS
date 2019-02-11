import { isValidProp, isReferenceType } from './validation';
/**
 *
 * @param {array} objects
 * @param {array} alreadyVisualised // internals that are already in memory
 *
 */

export default function createGraphFromObjects(objects, alreadyVisualised) {
  const referenceEdges = new Map();
  const V = [];
  function traverseObject(object) {
    const symbols = Object.getOwnPropertySymbols(object);

    if (V.includes(object) || (alreadyVisualised && alreadyVisualised.includes(object))) {
      const objectInfo = symbols[symbols.length - 1];
      object[objectInfo].numOfReferences++;
      return;
    }
    let hasObjectInfo = false;
    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];
      if (symbol.toString() === 'Symbol(objectInfo)') {
        hasObjectInfo = true;
        break;
      }
    }
    if (!hasObjectInfo) {
      /*
      This should not be here. Function should be pure and not mutate.!!!
      The following mutation on object is used
      to track how many references (including prototype chain) specific object has toward it
      This will be used for drawing purposes so that objects with more references appear above

      Symbol properties are not enumerable and can be used to add 'hidden' properties on objects
    */

      object[Symbol('objectInfo')] = { numOfReferences: 1, isDisplayed: true, isShrinked: true };
    }

    V.push(object);
    const prototype = Object.getPrototypeOf(object);
    if (prototype !== null) {
      traverseObject(prototype);
    }

    const props = Object.getOwnPropertyNames(object);
    props.forEach((prop) => {
      if (!isValidProp(object, prop)) return;
      const value = object[prop];

      if (isReferenceType(value)) {
        const objectPropMap = [object, prop];
        referenceEdges.set(objectPropMap, value);
        traverseObject(value);
      }
    });
  }
  objects.forEach(object => traverseObject(object));

  return {
    V, referenceEdges,
  };
}
