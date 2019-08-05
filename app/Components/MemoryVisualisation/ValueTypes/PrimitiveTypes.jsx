import React from 'react';
import PropTypes from 'prop-types';

import { Services } from '../../../Shared';
import {
  String, Number, Null, Undefined, Boolean,
} from './PrimitiveTypesUI';

const { isNull, isDef } = Services.Validation;

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
const Primitives = ({ value }) => {
  if (isDef(value)) {
    return typeComponents[typeof value](value);
  }
  return isNull(value) ? <Null>null</Null> : <Undefined>undefined</Undefined>;
};

Primitives.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
};

export default Primitives;
