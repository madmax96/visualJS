import React from 'react';
import PropTypes from 'prop-types';
import {
  Dot, KeyValue, Function, Obj, Array,
} from '../../../UI/components/ObjectVisualisation';
import { FlexContainer } from '../../../UI/Layout';
import { isReferenceType, isValidProp } from '../../../utils/validation';
import getLastSymbolValue from '../../../utils/getLastSymbolValue';

import Primitive from './PrimitiveTypes';

const objectTypes = {
  function: keyValuePairs => <Function>{keyValuePairs}</Function>,
  object: keyValuePairs => <Obj>{keyValuePairs}</Obj>,
  array: keyValuePairs => <Array>{keyValuePairs}</Array>,
};
export default class ObjectNode extends React.Component {
  constructor(props) {
    super(props);
    this.referenceDot = React.createRef();
    this.prototypeDot = React.createRef();
    this.drawPrototypeLine = this.drawPrototypeLine.bind(this);
    this.validKeys = Object.getOwnPropertyNames(props.object).filter(isValidProp);
    this.referenceProps = {};
    this.validKeys
      .filter(key => isReferenceType(props.object[key])).forEach((key) => {
        this.referenceProps[key] = React.createRef();
      });
  }

  componentDidMount() {
    /**
     *implement shrink and expand
     *show only currently visible objects
     */
    const {
      offsetTop: protoY, offsetLeft: protoX, clientWidth, clientHeight,
    } = this.prototypeDot.current;
    const objectInfo = getLastSymbolValue(this.props.object);
    objectInfo.prototypeDot = {
      x: protoX + clientWidth / 2,
      y: protoY + clientHeight / 2,
    };

    const {
      offsetTop: refY, offsetLeft: refX, clientWidth: refDotWidth, clientHeight: refDotHeight,
    } = this.referenceDot.current;
    objectInfo.refDot = {
      x: refX + refDotWidth / 2,
      y: refY + refDotHeight / 2,
    };

    objectInfo.referenceProps = {};
    Object.keys(this.referenceProps).forEach((key) => {
      const {
        offsetTop: y, offsetLeft: x, clientWidth, clientHeight,
      } = this.referenceProps[key].current;
      objectInfo.referenceProps[key] = {
        x: x + clientWidth / 2,
        y: y + clientHeight / 2,
      };
    });
  }

  drawPrototypeLine() {
    const { object } = this.props;
    const objectProto = Object.getPrototypeOf(this.props.object);

    const { $$x: x1, $$y: y1 } = object;
    const { $$x: x2, $$y: y2 } = objectProto;

    const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line'); // Create a path in SVG's namespace
    newLine.setAttribute('x1', x1);
    newLine.setAttribute('y1', y1);
    newLine.setAttribute('x2', x2);
    newLine.setAttribute('y2', y2);
    newLine.style.stroke = '#FAC863'; // Set stroke colour
    newLine.style.strokeWidth = '2px';
    this.props.drawLine(newLine);
  }

  render() {
    const { object, drawPrototypeLine } = this.props;
    const pairs = [];
    this.validKeys.forEach((key, i) => {
      // if (i > 3) return;
      pairs.push(
        <KeyValue key={i}>
          <KeyValue.Key>
            {key}
                :
          </KeyValue.Key>
          {!isReferenceType(object[key])
            ? <Primitive value={object[key]} />
            : <Dot innerRef={this.referenceProps[key]} reference />}
        </KeyValue>,
      );
    });
    let type = typeof object;
    if (window.Array.isArray(object)) type = 'array';
    return (
      <div>
        {objectTypes[type](pairs)}
        <FlexContainer justify_content="center">
          <Dot reference mr={5} innerRef={this.referenceDot} />
          <Dot innerRef={this.prototypeDot} onClick={this.drawPrototypeLine} />
        </FlexContainer>
      </div>
    );
  }
}

ObjectNode.propTypes = {
  object: PropTypes.any.isRequired,
  drawLine: PropTypes.func.isRequired,
};
