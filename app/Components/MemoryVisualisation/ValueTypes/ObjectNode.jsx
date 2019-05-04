import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  KeyValue, Function, Obj, Array,
} from './ObjectNodeUI';
import { Dot } from '../MemoryVisualisationUI';
import { FlexContainer } from '../../../Shared/UIComponents/LayoutGrid/Layout';
import { Validation } from '../../../Shared/Services';
import { pickValidProps } from '../MemoryVisualisationService';

import Primitive from './PrimitiveTypes';

const { isReferenceType } = Validation;

const objectTypes = {
  function: keyValuePairs => <Function>{keyValuePairs}</Function>,
  object: keyValuePairs => <Obj>{keyValuePairs}</Obj>,
  array: keyValuePairs => <Array>{keyValuePairs}</Array>,
};
const ObjectNode = (props) => {
  const referenceDot = useRef();
  const prototypeDot = useRef();
  const moveObjectDot = useRef();
  const objectRef = useRef();
  // this.drawPrototypeLine = this.drawPrototypeLine.bind(this);
  // this.shrinkExpand = this.shrinkExpand.bind(this);
  // this.setMousemoveHandler = this.setMousemoveHandler.bind(this);
  const referenceProps = {};
  useEffect(() => {
    const {
      offsetTop: protoY, offsetLeft: protoX, clientWidth, clientHeight,
    } = prototypeDot.current;
    const { objectInfo } = props;
    objectInfo.prototypeDot = {
      x: protoX + clientWidth / 2,
      y: protoY + clientHeight / 2,
    };

    const {
      offsetTop: refY, offsetLeft: refX, clientWidth: refDotWidth, clientHeight: refDotHeight,
    } = referenceDot.current;
    objectInfo.refDot = {
      x: refX + refDotWidth / 2,
      y: refY + refDotHeight / 2,
    };

    objectInfo.referenceProps = {};
    Object.keys(referenceProps).forEach((key) => {
      const {
        offsetTop: y, offsetLeft: x, clientWidth, clientHeight,
      } = referenceProps[key].current;
      objectInfo.referenceProps[key] = {
        x: x + clientWidth / 2,
        y: y + clientHeight / 2,
      };
    });
  });

  // setMousemoveHandler(e) {
  //   this.props.clearLines();
  //   const { current: objectInDOM } = this.objectRef;
  //   objectInDOM.style.position = 'absolute';
  //   window.onmousemove = (e) => {
  //     // const newWidth = Math.min(Math.round((e.clientX / window.innerWidth) * 100), 50);
  //     // this.props.onWidthChange(newWidth);
  //     objectInDOM.style.left = `${e.screenX}px`;
  //     objectInDOM.style.top = `${e.screenY - objectInDOM.clientHeight}px`;
  //     // console.log(e);
  //   };
  //   window.onmouseup = () => {
  //     window.onmousemove = null;
  //     window.onmouseup = null;
  //     this.props.redraw();
  //   };

  //   e.preventDefault(); // to prevent selection of text
  // }

  // drawPrototypeLine() {
  //   const { object } = this.props;
  //   const objectProto = Object.getPrototypeOf(this.props.object);
  //   const objectInfo = getLastSymbolValue(object);
  //   const objectProtoInfo = getLastSymbolValue(objectProto);

  //   const dot1 = objectInfo.prototypeDot;
  //   const dot2 = objectProtoInfo.prototypeDot;
  //   if (dot1 && dot2) {
  //     const line = createSVGLine(dot1, dot2, { stroke: 'red', strokeWidth: '2px' });
  //     this.props.drawSingleLine(line);
  //   }
  // }

  // shrinkExpand() {
  //   const { object } = this.props;
  //   const objectInfo = getLastSymbolValue(object);

  //   objectInfo.isShrinked = !objectInfo.isShrinked;
  //   this.props.redraw();
  // }
  const { object, isShrinked } = props;
  const pairs = [];
  const validKeys = pickValidProps(object, isShrinked ? 4 : null);
  validKeys
    .filter(key => isReferenceType(object[key])).forEach((key) => {
      referenceProps[key] = React.createRef();
    });

  validKeys.forEach((key, i) => {
    pairs.push(
      <KeyValue key={i}>
        <KeyValue.Key>
          {key}
                :
        </KeyValue.Key>
        {!isReferenceType(object[key])
          ? <Primitive value={object[key]} />
          : <Dot ref={referenceProps[key]} reference />}
      </KeyValue>,
    );
  });
  let type = typeof object;
  if (window.Array.isArray(object)) type = 'array';
  return (
    <div ref={objectRef}>
      <Dot ref={moveObjectDot} onMouseDown={() => {}} />
      <div onClick={() => {}}>
        {objectTypes[type](pairs)}
      </div>

      <FlexContainer justify_content="center">
        <Dot reference mr={5} ref={referenceDot} />
        <Dot ref={prototypeDot} onClick={() => {}} />
      </FlexContainer>
    </div>
  );
};

ObjectNode.propTypes = {
  object: PropTypes.any.isRequired,
  drawSingleLine: PropTypes.func.isRequired,
  isShrinked: PropTypes.bool,
};

export default ObjectNode;
