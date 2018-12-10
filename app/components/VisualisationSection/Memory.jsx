import React from 'react';
import PropTypes from 'prop-types';
import { generate } from 'shortid';
import { FlexContainer, FlexItem } from '../../UI/Layout';
import ObjectNode from './ValueTypes/ObjectNode';
import { isValidProp, isReferenceType } from '../../utils/validation';
import getLastSymbolValue from '../../utils/getLastSymbolValue';
import Var from './Var';

const Memory = ({ memoryGraph, globals, drawLine }) => {
  if (!memoryGraph) return null;
  const { V } = memoryGraph;
  const visualised = [];
  // group objects by number of references they have
  const grouped = V.reduce((accumulated, object) => {
    const { numOfReferences } = getLastSymbolValue(object);
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
          {singleReferenceObjects.map(object => (
            <FlexItem key={generate()} basis="auto">
              <ObjectNode object={object} drawLine={drawLine} />
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
          const { numOfReferences } = getLastSymbolValue(object[prop]);
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
          <FlexItem basis="auto" key={generate()}>
            <ObjectNode object={object} drawLine={drawLine} />
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
  const globalVarNames = Object.getOwnPropertyNames(globals);
  // show variables
  visualised.push(
    <FlexContainer key={generate()} justify_content="space-evenly" align_items="center" flex_wrap>
      {globalVarNames.filter(varName => !(typeof globals[varName] === 'function' && globals[varName].name === varName))
        .map(varName => <Var key={generate()} name={varName} value={globals[varName]} />)}
    </FlexContainer>,
  );
  return (
    <div>
      {visualised}
    </div>
  );
};

Memory.propTypes = {
  memoryGraph: PropTypes.exact({
    V: PropTypes.arrayOf(PropTypes.any),
    referenceEdges: PropTypes.arrayOf(PropTypes.instanceOf(Map)),
    prototypeEdges: PropTypes.arrayOf(PropTypes.instanceOf(Map)),
  }),
  globals: PropTypes.objectOf(PropTypes.any),
};

export default Memory;
