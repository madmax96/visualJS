import React, {
  useRef, useState, useContext, useEffect,
} from 'react';
import Box from '@material-ui/core/Box';
import { generate } from 'shortid';

// import PropTypes from 'prop-types';
import { GlobalContext } from '../../GlobalContextProvider';
import {
  replaceLetConst,
  createGraphFromObjects,
  separateObjectsAndGlobalVariables,
  removeAllDOMChildNodes,
  groupObjectsByFrequency,
  drawReferenceLines,
  drawPrototypeLines,
} from './MemoryVisualisationService';
import { Validation } from '../../Shared/Services';
import { JS_INTERNALS_TO_VISUALISE } from '../../constants';
import { SvgContainer } from './MemoryVisualisationUI';
import ObjectNode from './ValueTypes/ObjectNode';
import VariableBox from './VariableBox';

const { isReferenceType, isValidProp } = Validation;

const drawObjectsAtLevel = (objects, objectsInfoMap, oneReferenceObjects, singleReferenceObjects,
  drawn = []) => {
  let singleReferenceNext = [];
  const objectsToTraverse = objects || singleReferenceObjects;
  if (!objects) {
    drawn.push(
      <Box display="flex" flexDirection="column" key={generate()}>
        {singleReferenceObjects.map((object) => {
          const objectInfo = objectsInfoMap.get(object);
          return (
            <Box key={generate()} flexBasis="auto">
              <ObjectNode
                object={object}
                objectInfo={objectInfo}
              />
            </Box>
          );
        })}
      </Box>,
    );
  }
  objectsToTraverse.forEach((object) => {
    const propNames = Object.getOwnPropertyNames(object);
    propNames.forEach((prop) => {
      if (!isValidProp(object, prop)) return;
      if (isReferenceType(object[prop])) {
        const { numOfReferences } = objectsInfoMap.get(object[prop]);
        if (numOfReferences == 1) {
          singleReferenceNext.push(object[prop]);
          const index = oneReferenceObjects.indexOf(object[prop]);
          if (index > -1) {
            oneReferenceObjects.splice(index, 1);
          }
        }
      }
    });
    if (objects) {
      const objectInfo = objectsInfoMap.get(object);
      drawn.push(
        <Box flexBasis="auto" key={generate()}>
          <ObjectNode
            object={object}
            objectInfo={objectInfo}
          />
        </Box>,
      );
      if (singleReferenceNext.length) {
        drawObjectsAtLevel(null, objectsInfoMap, oneReferenceObjects, singleReferenceNext, drawn);
        singleReferenceNext = [];
      }
    }
  });
  if (!objects && singleReferenceNext.length) {
    drawObjectsAtLevel(null, objectsInfoMap, oneReferenceObjects, singleReferenceNext, drawn);
  }
  return drawn;
};

/** TODO
 *  Move drawing algorithm to Service and make it encapsulated, functional and independent
 *  */
const VisualisationSection = () => {
  const { code } = useContext(GlobalContext);
  const [memoryState, setMemoryState] = useState({
    internalObjects: null,
    memoryGraph: null,
    internalGlobalVariables: null,
    globalVariables: null,
  });
  const [errorState, setErrorState] = useState('');
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
      const newProps = newGlobalObjectProps
        .filter(prop => !globalObjectProps.includes(prop));

      const {
        objects,
        variables: globalVariables,
      } = separateObjectsAndGlobalVariables(newProps, sandboxEnv);
      const {
        objects: internalObjects,
        variables: internalGlobalVariables,
      } = separateObjectsAndGlobalVariables(JS_INTERNALS_TO_VISUALISE, sandboxEnv);
      const memoryGraph = createGraphFromObjects([...internalObjects, ...objects]);
      // restore sandbox
      newProps.forEach((key) => {
        delete sandboxEnv[key];
      });
      setMemoryState({
        memoryGraph, internalObjects, globalVariables, internalGlobalVariables,
      });
      setErrorState('');
    }
  }, [code]);
  const { V, referenceEdges, objectsInfoMap } = memoryState.memoryGraph || {};
  const { globalVariables } = memoryState;


  useEffect(() => {
    const { height } = memoryContainerElement.current.getBoundingClientRect();
    const SVGContainerNode = svgContainerElement.current;
    SVGContainerNode.style.height = height;
    // // remove all lines before drawing new ones
    removeAllDOMChildNodes(SVGContainerNode);
    if (V) {
      drawReferenceLines(referenceEdges, objectsInfoMap, SVGContainerNode);
      drawPrototypeLines(V, objectsInfoMap, SVGContainerNode);
    }
  });

  const visualised = [];
  if (V) {
    const { grouped, oneReferenceObjects } = groupObjectsByFrequency(V, objectsInfoMap);

    Object.keys(grouped).map(num => +num).sort((a, b) => b - a)
      .forEach((num) => {
        const objectsAtLevel = grouped[num];
        visualised.push(
          <Box display="flex" key={generate()} justifyContent="space-evenly" alignItems="center" flexWrap="wrap">
            {drawObjectsAtLevel(objectsAtLevel, objectsInfoMap, oneReferenceObjects)}
          </Box>,
        );
      });

    if (oneReferenceObjects.length) {
      visualised.push(
        <Box display="flex" key={generate()} justifyContent="space-evenly" alignItems="center" flexWrap="wrap">
          {drawObjectsAtLevel(oneReferenceObjects, objectsInfoMap, oneReferenceObjects)}
        </Box>,
      );
    }
  }
  if (globalVariables) {
    const globalVarNames = Object.getOwnPropertyNames(globalVariables);
    // show variables
    visualised.push(
      <Box display="flex" key={generate()} justifyContent="space-evenly" alignItems="center" flexWrap="wrap">
        {globalVarNames
          .map(varName => (
            <VariableBox
              key={generate()}
               // addVarLine={addVarLine}
              name={varName}
              value={globalVariables[varName]}
              objectInfo={objectsInfoMap.get(globalVariables[varName])}
            />
          ))}
      </Box>,
    );
  }

  return (
    <div>
      <Box display="none">
        <iframe title="sandboxEnvElement" src="" ref={sandboxEnvElement} />
      </Box>
      <Box display="flex" flexDirection="column" position="relative" ref={memoryContainerElement}>
        <SvgContainer ref={svgContainerElement} />
        {visualised}
      </Box>
    </div>
  );
};

VisualisationSection.propTypes = {

};

export default VisualisationSection;
