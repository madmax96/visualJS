import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import ThumbUpRounded from '@material-ui/icons/ThumbUpRounded';
import {
  KeyValue, Function, Obj, Array,
} from './ObjectNodeUI';
import { Dot } from '../MemoryVisualisationUI';
import { Services } from '../../../Shared';
import { pickValidProps } from '../MemoryVisualisationService';

import Primitive from './PrimitiveTypes';

const { isReferenceType } = Services.Validation;

const objectTypes = {
  function: keyValuePairs => <Function>{keyValuePairs}</Function>,
  object: keyValuePairs => <Obj>{keyValuePairs}</Obj>,
  array: keyValuePairs => <Array>{keyValuePairs}</Array>,
};
const ObjectNode = ({ object, onRenderToDOM }) => {
  const referenceDot = useRef();
  const prototypeDot = useRef();
  const moveObjectDot = useRef();
  const objectRef = useRef();

  const validKeys = pickValidProps(object, null);
  const referenceProps = validKeys
    .filter(key => isReferenceType(object[key]))
    .reduce((obj, key) => ({
      ...obj,
      [key]: React.createRef(),
    }), {});

  const calculateDotsCoordinates = () => {
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
    };
  };

  useEffect(() => {
    const coords = calculateDotsCoordinates();
    onRenderToDOM({
      object,
      DOMElement: objectRef.current,
      coords,
    });
  }, []);

  const removeDragHandler = () => {
    window.onmousemove = null;
    window.onmouseup = null;
  };

  const setDragHandler = (e) => {
    e.preventDefault(); // to prevent selection of text
    const { current: objectInDOM } = objectRef;
    window.onmousemove = (e) => {
      objectInDOM.style.left = `${e.pageX}px`;
      objectInDOM.style.top = `${e.pageY - 64 - 969}px`;
    };
    window.onmouseup = removeDragHandler;
  };

  const pairs = validKeys.map((key, i) => (
    <KeyValue key={i}>
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
    <div ref={objectRef}>
      <ThumbUpRounded
        ref={moveObjectDot}
        onMouseDown={setDragHandler}
        onMouseUp={removeDragHandler}
      />
      <div onClick={() => {}}>
        {objectTypes[type](pairs)}
      </div>

      <Box display="flex" justifyContent="center">
        <Dot reference mr={5} ref={referenceDot} />
        <Dot ref={prototypeDot} onClick={() => {}} />
      </Box>
    </div>
  );
};

ObjectNode.propTypes = {
  object: PropTypes.any.isRequired,
  onRenderToDOM: PropTypes.func.isRequired,
};

export default ObjectNode;
