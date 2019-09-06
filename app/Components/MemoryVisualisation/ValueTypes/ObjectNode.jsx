import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import ThumbUpRounded from '@material-ui/icons/ThumbUpRounded';
import { generate as generateKey } from 'shortid';
import {
  KeyValue, Function, Obj, Array,
} from './ObjectNodeUI';

import { Dot } from '../MemoryVisualisationUI';
import { Services } from '../../../Shared';

import Primitive from './PrimitiveTypes';

const { isReferenceType, isValidProp } = Services.Validation;

const objectTypes = {
  function: keyValuePairs => <Function>{keyValuePairs}</Function>,
  object: keyValuePairs => <Obj>{keyValuePairs}</Obj>,
  array: keyValuePairs => <Array>{keyValuePairs}</Array>,
};
const ObjectNode = ({
  object, onRenderToDOM, left, top,
}) => {
  const referenceDot = useRef();
  const prototypeDot = useRef();
  const moveObjectDot = useRef();
  const objectRef = useRef();
  const [{ leftState, topState }, setObjectNodeCoords] = useState({ leftState: left, topState: top });
  const validKeys = Object.getOwnPropertyNames(object).filter(prop => isValidProp(object, prop));
  const referenceProps = validKeys
    .filter(key => isReferenceType(object[key]))
    .reduce((obj, key) => ({
      ...obj,
      [key]: React.createRef(),
    }), {});

  const calculateDotsCoordinates = () => {
    const { offsetLeft, offsetTop } = objectRef.current;
    const objectCoords = { x: offsetLeft, y: offsetTop };
    const {
      offsetTop: protoY, offsetLeft: protoX, clientWidth, clientHeight,
    } = prototypeDot.current;
    const prototypeDotCoords = {
      x: protoX + clientWidth / 2,
      y: protoY + clientHeight / 2,
    };

    const {
      offsetTop: refY, offsetLeft: refX, clientWidth: refDotWidth, clientHeight: refDotHeight,
    } = referenceDot.current;
    const refDotCoords = {
      x: refX + refDotWidth / 2,
      y: refY + refDotHeight / 2,
    };

    const referencePropsCoords = Object.keys(referenceProps)
      .reduce((obj, key) => {
        const {
          offsetTop: y, offsetLeft: x, clientWidth, clientHeight,
        } = referenceProps[key].current;
        return {
          ...obj,
          [key]: {
            x: x + clientWidth / 2,
            y: y + clientHeight / 2,
          },
        };
      }, {});

    return {
      prototypeDotCoords,
      refDotCoords,
      referencePropsCoords,
      objectCoords,
    };
  };

  useEffect(() => {
    if (leftState != null && topState !== null) return;
    onRenderToDOM(calculateDotsCoordinates());
    // setObjectNodeCoords({ left: offsetLeft, top: offsetTop });
  }, []);

  const removeDragHandler = () => {
    window.onmousemove = null;
    window.onmouseup = null;
  };

  const setDragHandler = (e) => {
    e.preventDefault(); // to prevent selection of text
    window.onmousemove = (e) => {
      setObjectNodeCoords({ leftState: e.pageX, topState: e.pageY - 64 - 969 });
      // call passed function and provide new coords for all dots
      // onRenderToDOM({
      //   ...calculateDotsCoordinates(),
      //   objectCoords: { x: e.pageX, y: e.pageY - 64 - 969 },
      // });
    };
    window.onmouseup = removeDragHandler;
  };

  const pairs = validKeys.map(key => (
    <KeyValue key={generateKey()}>
      <KeyValue.Key>
        {key}
          :
      </KeyValue.Key>
      {!isReferenceType(object[key])
        ? <Primitive value={object[key]} />
        : <Dot ref={referenceProps[key]} reference />}
    </KeyValue>
  ));

  let type = typeof object;
  if (window.Array.isArray(object)) type = 'array';
  return (
    <Box
      ref={objectRef}
      left={`${leftState}px`}
      top={`${topState}px`}
      position={(leftState != null && topState != null) ? 'absolute' : 'unset'}
    >
      <ThumbUpRounded
        ref={moveObjectDot}
        onMouseDown={setDragHandler}
        onMouseUp={removeDragHandler}
      />
      <div>
        {objectTypes[type](pairs)}
      </div>

      <Box>
        <Dot reference mr={5} ref={referenceDot} />
        <Dot ref={prototypeDot} onClick={() => {}} />
      </Box>
    </Box>
  );
};

ObjectNode.propTypes = {
  object: PropTypes.any.isRequired,
  onRenderToDOM: PropTypes.func.isRequired,
  position: PropTypes.string,
};

export default ObjectNode;
