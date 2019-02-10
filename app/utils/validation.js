import { BY_VALUE } from '../config';

export function isValidProp(object, prop) {
  return !(typeof object === 'function' && (prop === 'arguments' || prop === 'callee' || prop === 'caller'));// these props are not accessible due to strict mode functions
}

export function isReferenceType(value) {
  return !BY_VALUE.includes(typeof value) && value !== null;
}

export function isNull(v) {
  return v === null;
}
export function isUndefined(v) {
  return v === undefined;
}
export function isDef(v) {
  return !isUndefined(v) && !isNull(v);
}

/**
 *return all props except first 4 displayed(valid)

 * @param {object} object object to pick props from
 * @param {number} num num of props to pick, if not provided all props are returned
 *
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
