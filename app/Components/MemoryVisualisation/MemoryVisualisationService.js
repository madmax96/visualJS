import { Services } from '../../Shared';

const { isValidProp, isReferenceType } = Services.Validation;

export function replaceLetConst(code) {
  let lastMatch;
  const stringIndexes = [];
  // if let or const are inside a string then they shoudn't be replaced
  code.replace(/['`"]/g, (match, offset) => {
    if (code[offset - 1] !== '\\') {
      if (!lastMatch) {
        lastMatch = match;
        stringIndexes.push([offset]);
      } else if (lastMatch === match) {
        stringIndexes[stringIndexes.length - 1].push(offset);
        lastMatch = null;
      }
    }
  });
  return code.replace(/const |let /g, (match, offset) => {
    let isInString = false;
    for (let i = 0; i < stringIndexes.length; i++) {
      if (offset > stringIndexes[i][0] && offset < stringIndexes[i][1]) {
        isInString = true;
        break;
      }
    }
    return isInString ? match : 'var ';
  });
}


// export function drawReferenceLines(referenceMap, objectsInfoMap, node) {
//   const refKeys = referenceMap.keys();
//   for (const objectPropMap of refKeys) {
//     const [object, prop] = objectPropMap;
//     const value = referenceMap.get(objectPropMap);
//     const objectInfo = objectsInfoMap.get(object);
//     const valueObjectInfo = objectsInfoMap.get(value);
//     const dot1 = objectInfo.referenceProps[prop];
//     const dot2 = valueObjectInfo.refDot;
//     if (dot1 && dot2) {
//       const line = createSVGLine(dot1, dot2, { stroke: '#FAC863', strokeWidth: '2px' });
//       drawSingleLine(line, node);
//     }
//   }
// }
// export function drawPrototypeLines(V, objectsInfoMap, node) {
//   V.forEach((object) => {
//     const objectProto = Object.getPrototypeOf(object);
//     if (!objectProto) return;
//     const objectInfo = objectsInfoMap.get(object);
//     const objectProtoInfo = objectsInfoMap.get(objectProto);

//     const dot1 = objectInfo.prototypeDot;
//     const dot2 = objectProtoInfo.prototypeDot;
//     if (dot1 && dot2) {
//       const line = createSVGLine(dot1, dot2, { stroke: 'red', strokeWidth: '2px' });
//       drawSingleLine(line, node);
//     }
//   });
// }
export function groupObjectsByFrequency(objects) {
  const objectToFrequencyMap = new Map();

  const traverseObject = (object) => {
    const objectsStack = [object];
    // debugger;
    while (objectsStack.length) {
      const currentObject = objectsStack.pop();
      if (objectToFrequencyMap.has(currentObject)) {
        continue;
      }
      objectToFrequencyMap.set(currentObject, 0);
      const objectsPrototype = Object.getPrototypeOf(currentObject);
      let counterToSet = 1;
      if (objectToFrequencyMap.has(objectsPrototype)) {
        counterToSet = objectToFrequencyMap.get(objectsPrototype) + 1;
      }
      objectToFrequencyMap.set(objectsPrototype, counterToSet);
      const objectProperties = Object.getOwnPropertyNames(currentObject)
        .filter(prop => (isValidProp(currentObject, prop) && isReferenceType(currentObject[prop])));
      objectsStack.push(...objectProperties.map(prop => currentObject[prop]));
    }
  };

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    traverseObject(object);
  }

  return objectToFrequencyMap;
}
