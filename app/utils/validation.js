import { BY_VALUE } from '../config';

export function isValidProp(prop) {
  return !(prop === 'arguments' || prop === 'callee' || prop === 'caller');// these props are not accessible due to strict mode functions
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
