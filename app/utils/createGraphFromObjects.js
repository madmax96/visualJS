import { isValidProp, isReferenceType } from './validation';
/**
 *
 * @param {array} objects
 *
 */

export default function createGraphFromObjects(objects) {
  const referenceEdges = new Map();
  const V = [];
  const objectsInfoMap = new Map();
  function traverseObject(object) {
    if (objectsInfoMap.get(object)) {
      return objectsInfoMap.get(object).numOfReferences++;
    }

    objectsInfoMap.set(object, { numOfReferences: 1 });
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
    V, referenceEdges, objectsInfoMap,
  };
}
