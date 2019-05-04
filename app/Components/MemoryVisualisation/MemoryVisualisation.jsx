import React, {
  useRef, useState, useContext, useEffect,
} from 'react';
import { generate } from 'shortid';

// import PropTypes from 'prop-types';
import { GlobalStateContext } from '../../GlobalStateProvider';
import {
  replaceLetConst, createGraphFromObjects, separateObjectsAndGlobalVariables,
  removeAllDOMChildNodes, createSVGLine,
} from './MemoryVisualisationService';
import { Validation } from '../../Shared/Services';
import { JS_INTERNALS_TO_VISUALISE } from '../../constants';
import { CommonUI, FlexContainer, FlexItem } from '../../Shared/UIComponents/LayoutGrid/Layout';
import { SvgContainer } from './MemoryVisualisationUI';
import ObjectNode from './ValueTypes/ObjectNode';
import VariableBox from './VariableBox';

const { isReferenceType, isValidProp } = Validation;

const VisualisationSection = () => {
  const { code } = useContext(GlobalStateContext);
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
  function drawSingleLine(line, node) {
    if (line) node.appendChild(line);
  }
  function drawReferenceLines(referenceMap, node) {
    const refKeys = referenceMap.keys();
    for (const objectPropMap of refKeys) {
      const [object, prop] = objectPropMap;
      const value = referenceMap.get(objectPropMap);
      const objectInfo = objectsInfoMap.get(object);
      const valueObjectInfo = objectsInfoMap.get(value);
      const dot1 = objectInfo.referenceProps[prop];
      const dot2 = valueObjectInfo.refDot;
      if (dot1 && dot2) {
        const line = createSVGLine(dot1, dot2, { stroke: '#FAC863', strokeWidth: '2px' });
        drawSingleLine(line, node);
      }
    }
  }
  function drawPrototypeLines(V, node) {
    V.forEach((object) => {
      const objectProto = Object.getPrototypeOf(object);
      if (!objectProto) return;
      const objectInfo = objectsInfoMap.get(object);
      const objectProtoInfo = objectsInfoMap.get(objectProto);

      const dot1 = objectInfo.prototypeDot;
      const dot2 = objectProtoInfo.prototypeDot;
      if (dot1 && dot2) {
        const line = createSVGLine(dot1, dot2, { stroke: 'red', strokeWidth: '2px' });
        drawSingleLine(line, node);
      }
    });
  }

  useEffect(() => {
    const { height } = memoryContainerElement.current.getBoundingClientRect();
    const SVGContainerNode = svgContainerElement.current;
    SVGContainerNode.style.height = height;
    // // remove all lines before drawing new ones
    removeAllDOMChildNodes(SVGContainerNode);
    V && drawReferenceLines(referenceEdges, SVGContainerNode);
    V && drawPrototypeLines(V, SVGContainerNode);
  });

  const visualised = [];
  if (V) {
  // group objects by number of references they have,and limit them to display only first 4 props
    // This should be in separate file !!!
    const grouped = V.reduce((accumulated, object) => {
      const objectInfo = objectsInfoMap.get(object);
      // const { numOfReferences, isShrinked, isDisplayed } = objectInfo;
      // if (isDisplayed) {
      //   const allObjectProps = Object.getOwnPropertyNames(object);
      //   const displayedProps = pickValidProps(object, isShrinked ? 4 : null);
      //   const notDisplayedProps = allObjectProps.filter(prop => !displayedProps.includes(prop));

      //   recursivelyHideObjects(object, notDisplayedProps);
      //   for (const prop of displayedProps) {
      //     if (isValidProp(object, prop) && isReferenceType(object[prop])) {
      //       const objectInfo = getLastSymbolValue(object[prop]);
      //       objectInfo.isDisplayed = true;
      //     }
      //   }
      // }
      const { numOfReferences } = objectInfo;
      if (accumulated[numOfReferences]) {
        accumulated[numOfReferences].push(object);
      } else {
        accumulated[numOfReferences] = [object];
      }
      return accumulated;
    }, {});

    // i don't want to represent objects with only one reference all at one line
    let oneReferenceObjects = [];
    if (grouped[1]) {
      oneReferenceObjects = grouped[1];
      delete grouped[1];
    }

    function drawObjectsAtLevel(objects, singleReferenceObjects, drawn = []) {
      let singleReferenceNext = [];
      const objectsToTraverse = objects || singleReferenceObjects;
      if (!objects) {
        drawn.push(
          <FlexContainer column key={generate()}>
            {singleReferenceObjects.map((object) => {
              const objectInfo = objectsInfoMap.get(object);
              return (
                <FlexItem key={generate()} basis="auto">
                  <ObjectNode
                    object={object}
                    objectInfo={objectsInfoMap.get(object)}
                  />
                </FlexItem>
              );
            })}
          </FlexContainer>,
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
            <FlexItem basis="auto" key={generate()}>
              <ObjectNode
                object={object}
                objectInfo={objectsInfoMap.get(object)}
              />
            </FlexItem>,
          );
          if (singleReferenceNext.length) {
            drawObjectsAtLevel(null, singleReferenceNext, drawn);
            singleReferenceNext = [];
          }
        }
      });
      if (!objects && singleReferenceNext.length) {
        drawObjectsAtLevel(null, singleReferenceNext, drawn);
      }
      return drawn;
    }

    Object.keys(grouped).map(num => +num).sort((a, b) => b - a)
      .forEach((num) => {
        const objectsAtLevel = grouped[num];
        visualised.push(
          <FlexContainer key={generate()} justify_content="space-evenly" align_items="center" flex_wrap>
            {drawObjectsAtLevel(objectsAtLevel)}
          </FlexContainer>,
        );
      });

    if (oneReferenceObjects.length) {
      visualised.push(
        <FlexContainer key={generate()} justify_content="space-evenly" align_items="center" flex_wrap>
          {drawObjectsAtLevel(oneReferenceObjects)}
        </FlexContainer>,
      );
    }
  }

  if (globalVariables) {
    const globalVarNames = Object.getOwnPropertyNames(globalVariables);
    // show variables
    visualised.push(
      <FlexContainer key={generate()} justify_content="space-evenly" align_items="center" flex_wrap>
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
      </FlexContainer>,
    );
  }
  console.log(objectsInfoMap);

  function recursivelyHideObjects(object, props) {
    for (const prop of props) {
      if (isValidProp(object, prop) && isReferenceType(object[prop])) {
        const objectInfo = objectsInfoMap.get(object[prop]);
        if (objectInfo.numOfReferences === 1) {
          objectInfo.isDisplayed = false;
          recursivelyHideObjects(object[prop], Object.getOwnPropertyNames(object[prop]));
        }
      }
    }
  }
  return (
    <div>
      <CommonUI dNone>
        <iframe title="sandboxEnvElement" src="" ref={sandboxEnvElement} />
      </CommonUI>
      <FlexContainer column relative ref={memoryContainerElement}>
        <SvgContainer ref={svgContainerElement} />
        {visualised}
      </FlexContainer>
    </div>
  );
};

VisualisationSection.propTypes = {

};

export default VisualisationSection;
