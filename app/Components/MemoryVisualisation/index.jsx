import React, {
  useRef, useState, useContext, useEffect,
} from 'react';
import Box from '@material-ui/core/Box';
import _partition from 'lodash/partition';
import _difference from 'lodash/difference';
import { generate as generateKey } from 'shortid';
// import PropTypes from 'prop-types';
import { GlobalContext } from '../../GlobalContextProvider';
import {
  replaceLetConst,
  unwindAllObjects,
} from './MemoryVisualisationService';
import { Services } from '../../Shared';
import { JS_INTERNALS_TO_VISUALISE } from '../../constants';
import { SvgContainer } from './MemoryVisualisationUI';
import Line from './Line';
import ObjectNode from './ValueTypes/ObjectNode';
import VariableBox from './VariableBox';

const { isReferenceType, isValidProp } = Services.Validation;
const RenderedMemoryObjects = new Map();

const VisualisationSection = () => {
  const { code } = useContext(GlobalContext);
  const [errorState, setErrorState] = useState('');
  const [objToCoords, setObjToCoords] = useState(new Map());
  const [visualisedObjects, setVisualisedObjects] = useState([]);
  const [lines, setLines] = useState([]);
  // have state also for visualised Lines
  const sandboxEnvElement = useRef();
  const svgContainerElement = useRef();
  const memoryContainerElement = useRef();
  useEffect(() => {
    const sandboxEnv = sandboxEnvElement.current.contentWindow;
    const globalObjectProps = Object.getOwnPropertyNames(sandboxEnv);

    if (code) {
      try {
      // first evaluation to check for errors
        sandboxEnv.eval(code);
      } catch (e) {
        return setErrorState(e.message);
      }
      /* replace all let and const declarations with var
     var declarations are available on global object */
      const codeToExecute = replaceLetConst(code);
      sandboxEnv.eval(codeToExecute);
      const newGlobalObjectProps = Object.getOwnPropertyNames(sandboxEnv);
      const newProps = _difference(newGlobalObjectProps, globalObjectProps);
      const [referenceTypes, valueTypes] = _partition(
        [...JS_INTERNALS_TO_VISUALISE, ...newProps]
          .map(prop => ({ envVariableName: prop, envVariableValue: sandboxEnv[prop] })),
        ({ envVariableValue }) => isReferenceType(envVariableValue),
      );

      const allObjects = unwindAllObjects(referenceTypes
        .map(refType => refType.envVariableValue));

      const toVisualise = allObjects.map(obj => (
        <Box key={generateKey()} flexBasis="20%">
          <ObjectNode
            object={obj}
            onRenderToDOM={
                ({ object, coords }) => {
                  objToCoords.set(obj, coords);
                }
              }
          />
        </Box>
      ));
      setVisualisedObjects(toVisualise);
    }
  }, [code]);

  useEffect(() => {
    const sandboxEnv = sandboxEnvElement.current.contentWindow;
    const { height } = memoryContainerElement.current.getBoundingClientRect();
    const SVGContainerNode = svgContainerElement.current;
    SVGContainerNode.style.height = height;
    // draw lines
    const referenceLines = [];
    for (const [object, coords] of objToCoords.entries()) {
      const objectProps = Object.getOwnPropertyNames(object)
        .filter(prop => isValidProp(object, prop) && isReferenceType(object[prop]));

      const propsNum = objectProps.length;
      for (let i = 0; i < propsNum; i++) {
        const prop = objectProps[i];
        const dot1 = coords.referencePropsCoords[prop];

        const referencedObject = object[prop];
        const referencedObjectCoords = objToCoords.get(referencedObject);
        if (!referencedObjectCoords) continue;
        const dot2 = referencedObjectCoords.refDotCoords;
        referenceLines.push(<Line
          dot1={dot1}
          dot2={dot2}
          stroke="green"
          strokeWidth="2px"
          key={generateKey()}
        />);
      }
    }
    setLines(referenceLines);
  }, [visualisedObjects]);

  return (
    <>
      <Box display="none">
        <iframe title="sandboxEnvElement" src="" ref={sandboxEnvElement} />
      </Box>
      <Box display="flex" flexDirection="row" flexWrap="wrap" position="relative" ref={memoryContainerElement}>
        <SvgContainer ref={svgContainerElement}>
          {lines}
        </SvgContainer>
        {visualisedObjects}
      </Box>
    </>
  );
};

VisualisationSection.propTypes = {

};

export default VisualisationSection;
