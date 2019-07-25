import { BY_VALUE } from '../../constants';

export function isValidProp(object, prop) {
  // these props are not accessible due to strict mode functions
  return !(typeof object === 'function' && (prop === 'arguments' || prop === 'callee' || prop === 'caller'));
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
