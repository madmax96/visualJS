import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Services } from '../../../Shared';
import { Dot } from '../MemoryVisualisationUI';
import Primitive from '../ValueTypes/PrimitiveTypes';
import VarUI from './VariableBoxUI';

const { isReferenceType } = Services.Validation;

const VariableBox = ({ name, value, objectInfo }) => {
  const referenceDot = useRef();
  useEffect(() => {
    if (!referenceDot.current) return;
    const {
      offsetTop, offsetLeft, clientWidth, clientHeight,
    } = referenceDot.current;
    const dot1 = { x: offsetLeft + clientWidth / 2, y: offsetTop + clientHeight / 2 };
    const dot2 = objectInfo.refDot;
    if (dot1 && dot2) {
      if (objectInfo.referencedBy) {
        objectInfo.referencedBy.push(dot1);
      } else {
        objectInfo.referencedBy = [dot1];
      }
    }
  });

  return (
    <VarUI>
      <VarUI.Name>{name}</VarUI.Name>
      <VarUI.Value>
        {isReferenceType(value)
          ? <Dot reference ref={referenceDot} /> : <Primitive value={value} /> }
      </VarUI.Value>
    </VarUI>
  );
};

VariableBox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  addVarLine: PropTypes.func,
};

export default VariableBox;
