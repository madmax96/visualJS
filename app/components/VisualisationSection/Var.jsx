import React from 'react';
import { isReferenceType } from '../../utils/validation';
import { Dot } from '../../UI/components/ObjectVisualisation';
import Primitive from './ValueTypes/PrimitiveTypes';

import Var from '../../UI/components/Var';

export default ({ value, name }) => (
  <Var>
    <Var.Name>{name}</Var.Name>
    <Var.Value>
      {isReferenceType(value)
        ? <Dot reference /> : <Primitive value={value} /> }
    </Var.Value>
  </Var>);
