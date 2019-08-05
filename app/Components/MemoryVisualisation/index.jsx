import React, {
  useRef, useState, useContext, useEffect,
} from 'react';
import Box from '@material-ui/core/Box';
import _partition from 'lodash/partition';
import { generate } from 'shortid';

// import PropTypes from 'prop-types';
import { GlobalContext } from '../../GlobalContextProvider';
import {
  replaceLetConst,
  groupObjectsByFrequency,
} from './MemoryVisualisationService';
import { Services } from '../../Shared';

import { JS_INTERNALS_TO_VISUALISE } from '../../constants';
import { SvgContainer } from './MemoryVisualisationUI';
import Line from './Line';
import ObjectNode from './ValueTypes/ObjectNode';
import VariableBox from './VariableBox';


const { isReferenceType, isValidProp } = Services.Validation;
const drawObjectsAtLevel = (objects, objectsInfoMap, oneReferenceObjects, singleReferenceObjects,
  drawn = []) => {
  let singleReferenceNext = [];
  const objectsToTraverse = objects || singleReferenceObjects;
  if (!objects) {
    drawn.push(
      <Box display="flex" flexDirection="column" key={generate()}>
        {singleReferenceObjects.map(object => (
          <Box key={generate()} flexBasis="auto">
            <ObjectNode
              object={object}
            />
          </Box>
        ))}
      </Box>,
    );
  }
  objectsToTraverse.forEach((object) => {
    const propNames = Object.getOwnPropertyNames(object);
    propNames.forEach((prop) => {
      if (!isValidProp(object, prop)) return;
      if (isReferenceType(object[prop])) {
        const { numOfReferences } = objectsInfoMap.get(object[prop]);
        if (numOfReferences === 1) {
          singleReferenceNext.push(object[prop]);
          const index = oneReferenceObjects.indexOf(object[prop]);
          if (index > -1) {
            oneReferenceObjects.splice(index, 1);
          }
        }
      }
    });
    if (objects) {
      drawn.push(
        <Box flexBasis="auto" key={generate()}>
          <ObjectNode
            object={object}
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
  const objectToObjectInfoMap = new Map();
  const { code } = useContext(GlobalContext);
  const [memoryState, setMemoryState] = useState({
    internalObjects: null,
    memoryGraph: null,
    internalGlobalVariables: null,
    globalVariables: null,
  });
  const [errorState, setErrorState] = useState('');
  const [lines, setLines] = useState([]);
  const [visualisedObjects, setVisualisedObjects] = useState([]);
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

      const [referenceTypes, valueTypes] = _partition(
        [...JS_INTERNALS_TO_VISUALISE, ...newProps]
          .map(prop => ({ envVariableName: prop, envVariableValue: sandboxEnv[prop] })),
        ({ envVariableValue }) => isReferenceType(envVariableValue),
      );

      const objectsGroupedByFrequency = groupObjectsByFrequency(referenceTypes
        .map(refType => refType.envVariableValue));

      console.log(objectsGroupedByFrequency);

      setVisualisedObjects(referenceTypes.map(object => (
        <Box key={generate()} flexBasis="auto">
          <ObjectNode
            object={object.envVariableValue}
            onRenderToDOM={() => {}}
          />
        </Box>
      )));
      // Object.keys(grouped)
      //   .map(num => +num)
      //   .sort((a, b) => b - a)
      //   .forEach((num) => {
      //     const objectsAtLevel = grouped[num];
      //     visualisedObjects.push(
      //       <Box display="flex" key={generate()} justifyContent="space-evenly" alignItems="center" flexWrap="wrap">
      //         {drawObjectsAtLevel(objectsAtLevel, objectsInfoMap, oneReferenceObjects)}
      //       </Box>,
      //     );
      //   });

      // if (oneReferenceObjects.length) {
      //   visualisedObjects.push(
      //     <Box display="flex" key={generate()} justifyContent="space-evenly" alignItems="center" flexWrap="wrap">
      //       {drawObjectsAtLevel(oneReferenceObjects, objectsInfoMap, oneReferenceObjects)}
      //     </Box>,
      //   );
      // }
      // if (globalVariables) {
      //   const globalVarNames = Object.getOwnPropertyNames(globalVariables);
      //   // show variables
      //   visualisedObjects.push(
      //     <Box display="flex" key={generate()} justifyContent="space-evenly" alignItems="center" flexWrap="wrap">
      //       {globalVarNames
      //         .map(varName => (
      //           <VariableBox
      //             key={generate()}
      //              // addVarLine={addVarLine}
      //             name={varName}
      //             value={globalVariables[varName]}
      //             objectInfo={objectsInfoMap.get(globalVariables[varName])}
      //           />
      //         ))}
      //     </Box>,
      //   );
      // }
      // setErrorState('');
    }
  }, [code]);


  const drawConnectionLines = () => {
    if (V) {
      const localLines = [];
      const refKeys = referenceEdges.keys();
      for (const objectPropMap of refKeys) {
        const [object, prop] = objectPropMap;
        const value = referenceEdges.get(objectPropMap);
        const objectInfo = objectsInfoMap.get(object);
        const valueObjectInfo = objectsInfoMap.get(value);
        const dot1 = objectInfo.referenceProps[prop];
        const dot2 = valueObjectInfo.refDot;
        if (dot1 && dot2) {
          const L = <Line dot1={dot1} dot2={dot2} stroke="#FAC863" strokeWidth="2px" key={`${dot1.x}-${dot1.y}-${dot2.x}-${dot2.y}`} />;
          localLines.push(L);
        }
      }
      return localLines;
      // drawPrototypeLines(V, objectsInfoMap);
    }
  };

  // useEffect(() => {
  //   const { height } = memoryContainerElement.current.getBoundingClientRect();
  //   const SVGContainerNode = svgContainerElement.current;
  //   SVGContainerNode.style.height = height;

  //   setLines(drawConnectionLines());
  //   // nodes.forEach((node) => {
  //   //   const { offsetLeft: x, offsetTop: y } = node;
  //   //   node.style.left = `${Math.round(x)}px`;
  //   //   node.style.top = `${Math.round(y)}px`;
  //   // });
  //   // nodes.forEach((node) => {
  //   //   node.style.position = 'absolute';
  //   // });
  //   // // remove all lines before drawing new ones
  // }, [code, memoryState.memoryGraph]);

  return (
    <>
      <Box display="none">
        <iframe title="sandboxEnvElement" src="" ref={sandboxEnvElement} />
      </Box>
      <Box display="flex" flexDirection="column" position="relative" ref={memoryContainerElement}>
        {/* <SvgContainer ref={svgContainerElement}>
          {lines}
        </SvgContainer> */}
        {visualisedObjects}
      </Box>
    </>
  );
};

VisualisationSection.propTypes = {

};

export default VisualisationSection;
