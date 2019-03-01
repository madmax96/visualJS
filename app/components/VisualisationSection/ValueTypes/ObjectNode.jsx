import React from 'react';
import PropTypes from 'prop-types';
import {
  Dot, KeyValue, Function, Obj, Array, ObjectNodeUI,
} from '../../../UI/components/ObjectVisualisation';
import { FlexContainer } from '../../../UI/Layout';
import { isReferenceType, pickValidProps } from '../../../utils/validation';
import getLastSymbolValue from '../../../utils/getLastSymbolValue';
import createSVGLine from '../../../utils/createSVGLine';

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
    this.moveObjectDot = React.createRef();
    this.objectRef = React.createRef();
    this.drawPrototypeLine = this.drawPrototypeLine.bind(this);
    this.shrinkExpand = this.shrinkExpand.bind(this);
    this.setMousemoveHandler = this.setMousemoveHandler.bind(this);
  }

  componentDidMount() {
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

  setMousemoveHandler(e) {
    this.props.clearLines();
    const { current: objectInDOM } = this.objectRef;
    objectInDOM.style.position = 'absolute';
    window.onmousemove = (e) => {
      // const newWidth = Math.min(Math.round((e.clientX / window.innerWidth) * 100), 50);
      // this.props.onWidthChange(newWidth);
      objectInDOM.style.left = `${e.screenX}px`;
      objectInDOM.style.top = `${e.screenY - objectInDOM.clientHeight}px`;
      // console.log(e);
    };
    window.onmouseup = () => {
      window.onmousemove = null;
      window.onmouseup = null;
      this.props.redraw();
    };

    e.preventDefault(); // to prevent selection of text
  }

  drawPrototypeLine() {
    const { object } = this.props;
    const objectProto = Object.getPrototypeOf(this.props.object);
    const objectInfo = getLastSymbolValue(object);
    const objectProtoInfo = getLastSymbolValue(objectProto);

    const dot1 = objectInfo.prototypeDot;
    const dot2 = objectProtoInfo.prototypeDot;
    if (dot1 && dot2) {
      const line = createSVGLine(dot1, dot2, { stroke: 'red', strokeWidth: '2px' });
      this.props.drawSingleLine(line);
    }
  }

  shrinkExpand() {
    const { object } = this.props;
    const objectInfo = getLastSymbolValue(object);

    objectInfo.isShrinked = !objectInfo.isShrinked;
    this.props.redraw();
  }


  render() {
    const { object, isShrinked } = this.props;
    const pairs = [];

    this.validKeys = pickValidProps(object, isShrinked ? 4 : null);

    this.referenceProps = {};
    this.validKeys
      .filter(key => isReferenceType(object[key])).forEach((key) => {
        this.referenceProps[key] = React.createRef();
      });

    this.validKeys.forEach((key, i) => {
      pairs.push(
        <KeyValue key={i}>
          <KeyValue.Key>
            {key}
                :
          </KeyValue.Key>
          {!isReferenceType(object[key])
            ? <Primitive value={object[key]} />
            : <Dot ref={this.referenceProps[key]} reference />}
        </KeyValue>,
      );
    });
    let type = typeof object;
    if (window.Array.isArray(object)) type = 'array';
    return (
      <div ref={this.objectRef}>
        <Dot ref={this.moveObjectDot} onMouseDown={this.setMousemoveHandler} />
        <div onClick={this.shrinkExpand}>
          {objectTypes[type](pairs)}
        </div>

        <FlexContainer justify_content="center">
          <Dot reference mr={5} ref={this.referenceDot} />
          <Dot ref={this.prototypeDot} onClick={this.drawPrototypeLine} />
        </FlexContainer>
      </div>
    );
  }
}

ObjectNode.propTypes = {
  object: PropTypes.any.isRequired,
  drawSingleLine: PropTypes.func.isRequired,
  isShrinked: PropTypes.bool,
};
