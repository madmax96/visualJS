import React from 'react';
import PropTypes from 'prop-types';
import getLastSymbolValue from '../../utils/getLastSymbolValue';
import { isReferenceType } from '../../utils/validation';
import { Dot } from '../../UI/components/ObjectVisualisation';
import Primitive from './ValueTypes/PrimitiveTypes';
import createSVGLine from '../../utils/createSVGLine';

import VarUI from '../../UI/components/Var';

export default class Var extends React.Component {
  constructor(props) {
    super(props);
    this.referenceDot = React.createRef();
  }

  componentDidMount() {
    if (this.referenceDot.current) {
      const {
        offsetTop, offsetLeft, clientWidth, clientHeight,
      } = this.referenceDot.current;
      const dot1 = { x: offsetLeft + clientWidth / 2, y: offsetTop + clientHeight / 2 };
      const objectInfo = getLastSymbolValue(this.props.value);
      const dot2 = objectInfo.refDot;
      if (dot1 && dot2) {
        const line = createSVGLine(dot1, dot2, { stroke: 'red', strokeWidth: '2px' });
        this.props.addVarLine(line);
      }
    }
  }

  render() {
    const { name, value } = this.props;
    return (
      <VarUI>
        <VarUI.Name>{name}</VarUI.Name>
        <VarUI.Value>
          {isReferenceType(value)
            ? <Dot reference ref={this.referenceDot} /> : <Primitive value={value} /> }
        </VarUI.Value>
      </VarUI>
    );
  }
}

Var.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  addVarLine: PropTypes.func,
};
