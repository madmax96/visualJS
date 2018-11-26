import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer, FlexItem } from '../../UI/Layout';
import ObjectNode from './ValueTypes/ObjectNode';
import { isValidProp, isReferenceType } from '../../utils/validation';
import getLastSymbolValue from '../../utils/getLastSymbolValue';
import Var from './Var';

const Memory = ({ memoryGraph, globals }) => {
  if (!memoryGraph) return null;
  const { V, referenceEdges, prototypeEdges } = memoryGraph;
  const visualised = [];
  // group objects by number of references they have
  const grouped = V.reduce((accumulated, object) => {
    const numOfReferences = getLastSymbolValue(object);
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
        <FlexContainer column>
          {singleReferenceObjects.map(object => (
            <FlexItem basis="auto">
              <ObjectNode object={object} />
            </FlexItem>
          ))}
        </FlexContainer>,
      );
    }
    objectsToTraverse.forEach((object) => {
      const propNames = Object.getOwnPropertyNames(object);
      propNames.forEach((prop) => {
        if (!isValidProp(prop)) return;
        if (isReferenceType(object[prop])) {
          const numOfReferences = getLastSymbolValue(object[prop]);
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
        drawn.push(
          <FlexItem basis="auto">
            <ObjectNode object={object} />
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
    .forEach((num, i) => {
      const objectsAtLevel = grouped[num];
      visualised.push(
        <FlexContainer key={i} justify_content="space-evenly" align_items="center" flex_wrap>
          {drawObjectsAtLevel(objectsAtLevel)}
        </FlexContainer>,
      );
    });

  if (oneReferenceObjects.length) {
    visualised.push(
      <FlexContainer key="asdasd" justify_content="space-evenly" align_items="center" flex_wrap>
        {drawObjectsAtLevel(oneReferenceObjects)}
      </FlexContainer>,
    );
  }
  const globalVarNames = Object.getOwnPropertyNames(globals);
  // show variables
  visualised.push(
    <FlexContainer key="adsfgh" justify_content="space-evenly" align_items="center" flex_wrap>
      {globalVarNames.filter(varName => !(typeof globals[varName] === 'function' && globals[varName].name === varName))
        .map(varName => <Var name={varName} value={globals[varName]} />)}
    </FlexContainer>,
  );
  return (
    <div>
      {visualised}
    </div>
  );
};

Memory.propTypes = {
  MemoryGraph: PropTypes.exact({
    V: PropTypes.arrayOf(PropTypes.any),
    referenceEdges: PropTypes.arrayOf(PropTypes.instanceOf(Map)),
    prototypeEdges: PropTypes.arrayOf(PropTypes.instanceOf(Map)),
  }),
};

export default Memory;
