import React from 'react';
import PropTypes from 'prop-types';

import { isReferenceType } from '../../utils/validation';
import { Dot } from '../../UI/components/ObjectVisualisation';
import Primitive from './ValueTypes/PrimitiveTypes';

import VarUI from '../../UI/components/Var';

const Var = ({ value, name }) => (
  <VarUI>
    <VarUI.Name>{name}</VarUI.Name>
    <VarUI.Value>
      {isReferenceType(value)
        ? <Dot reference /> : <Primitive value={value} /> }
    </VarUI.Value>
  </VarUI>);

Var.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
};
export default Var;
