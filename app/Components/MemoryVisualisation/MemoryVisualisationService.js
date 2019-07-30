import { Validation } from '../../Shared/Services';

const { isValidProp, isReferenceType } = Validation;

/**
 * @param {Array} objects
 */
export function createGraphFromObjects(objects) {
  const referenceEdges = new Map();
  const objectsInfoMap = new Map();
  const V = [];
  function traverseObject(object) {
    const objectInfo = objectsInfoMap.get(object);
    if (objectInfo) {
      return objectInfo.numOfReferences++;
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


/**
 *return all props except first 4 displayed(valid)
 * @param {object} object object to pick props from
 * @param {number} num num of props to pick, if not provided all props are returned
 */
export function pickValidProps(object, num = -1) {
  const props = Object.getOwnPropertyNames(object);
  const shownProps = [];
  let counter = 0;
  for (const prop of props) {
    if (isValidProp(object, prop)) {
      shownProps.push(prop);
      counter++;
    }
    if (counter === num) {
      break;
    }
  }
  return shownProps;
}

export function createSVGLine(dot1, dot2, { stroke, strokeWidth }) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); // Create a path in SVG's namespace
  const { x, y } = dot1;
  const { x: x1, y: y1 } = dot2;
  if (!(Number.isInteger(x)
          && Number.isInteger(y)
          && Number.isInteger(x1) && Number.isInteger(y1))) return null;
  line.setAttribute('x1', x);
  line.setAttribute('y1', y);
  line.setAttribute('x2', x1);
  line.setAttribute('y2', y1);
  line.style.stroke = stroke; // Set stroke colour
  line.style.strokeWidth = '1px';
  return line;
}


export function removeAllDOMChildNodes(parentDOM) {
  if (!parentDOM) return;
  let fc = parentDOM.firstChild;
  while (fc) {
    parentDOM.removeChild(fc);
    fc = parentDOM.firstChild;
  }
}

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

/**
 * @param {Array<String>} props
 * @param {Object} globalObject
 * @returns {Object}
 */
export function separateObjectsAndGlobalVariables(props, globalObject) {
  const objects = [];
  const variables = {};
  props.forEach((key) => {
    const value = globalObject[key];
    if (isReferenceType(value)) {
      objects.push(value);
    }
    // if function has a name property than we don't visualise it as a variable box
    if (!(typeof value === 'function' && value.name === key)) {
      variables[key] = value;
    }
  });
  return { objects, variables };
}

function drawSingleLine(line, node) {
  if (line) node.appendChild(line);
}

export function drawReferenceLines(referenceMap, objectsInfoMap, node) {
  const refKeys = referenceMap.keys();
  for (const objectPropMap of refKeys) {
    const [object, prop] = objectPropMap;
    const value = referenceMap.get(objectPropMap);
    const objectInfo = objectsInfoMap.get(object);
    const valueObjectInfo = objectsInfoMap.get(value);
    const dot1 = objectInfo.referenceProps[prop];
    const dot2 = valueObjectInfo.refDot;
    if (dot1 && dot2) {
      const line = createSVGLine(dot1, dot2, { stroke: '#FAC863', strokeWidth: '2px' });
      drawSingleLine(line, node);
    }
  }
}
export function drawPrototypeLines(V, objectsInfoMap, node) {
  V.forEach((object) => {
    const objectProto = Object.getPrototypeOf(object);
    if (!objectProto) return;
    const objectInfo = objectsInfoMap.get(object);
    const objectProtoInfo = objectsInfoMap.get(objectProto);

    const dot1 = objectInfo.prototypeDot;
    const dot2 = objectProtoInfo.prototypeDot;
    if (dot1 && dot2) {
      const line = createSVGLine(dot1, dot2, { stroke: 'red', strokeWidth: '2px' });
      drawSingleLine(line, node);
    }
  });
}
export function groupObjectsByFrequency(V, objectsInfoMap) {
  // group objects by number of references they have,and limit them to display only first 4 props
  // This should be in separate file !!!
  const grouped = V.reduce((accumulated, object) => {
    const objectInfo = objectsInfoMap.get(object);
    // const { numOfReferences, isShrinked, isDisplayed } = objectInfo;
    // if (isDisplayed) {
    //   const allObjectProps = Object.getOwnPropertyNames(object);
    //   const displayedProps = pickValidProps(object, isShrinked ? 4 : null);
    //   const notDisplayedProps = allObjectProps.filter(prop => !displayedProps.includes(prop));

    //   recursivelyHideObjects(object, notDisplayedProps);
    //   for (const prop of displayedProps) {
    //     if (isValidProp(object, prop) && isReferenceType(object[prop])) {
    //       const objectInfo = getLastSymbolValue(object[prop]);
    //       objectInfo.isDisplayed = true;
    //     }
    //   }
    // }
    const { numOfReferences } = objectInfo;
    if (accumulated[numOfReferences]) {
      accumulated[numOfReferences].push(object);
    } else {
      accumulated[numOfReferences] = [object];
    }
    return accumulated;
  }, {});

  // i don't want to represent objects with only one reference all at one line
  let oneReferenceObjects = [];
  if (grouped[1]) {
    oneReferenceObjects = grouped[1];
    delete grouped[1];
  }
  return { grouped, oneReferenceObjects };
}

export function recursivelyHideObjects(object, props, objectsInfoMap) {
  for (const prop of props) {
    if (isValidProp(object, prop) && isReferenceType(object[prop])) {
      const objectInfo = objectsInfoMap.get(object[prop]);
      if (objectInfo.numOfReferences === 1) {
        objectInfo.isDisplayed = false;
        recursivelyHideObjects(object[prop], Object.getOwnPropertyNames(object[prop]));
      }
    }
  }
}
