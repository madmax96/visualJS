import React from 'react';
import { isNull, isDef } from '../../../utils/validation';
import {
  String, Number, Null, Undefined, Boolean,
} from '../../../UI/components/PrimitiveData';

const typeComponents = {
  string: value => (
    <String>
      {'"'}
      {value}
      {'"'}
    </String>
  ),
  number: value => <Number>{value.toString()}</Number>,
  boolean: value => <Boolean isTrue={value}>{value.toString()}</Boolean>,
};
export default ({ value }) => {
  if (isDef(value)) {
    return typeComponents[typeof value](value);
  }
  return isNull(value) ? <Null>null</Null> : <Undefined>undefined</Undefined>;
};
