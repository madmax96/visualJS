import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexContainer, FlexItem } from '../../UI/Layout';
import createSVGLine from '../../utils/createSVGLine';
import Memory from './Memory/Memory';
import removeAllDOMChildNodes from '../../utils/removeAllDOMChildNodes';


// this can became  same as Memory.jsx is now ,
// should draw objects , produce all line coordinates and svg container height and give it to Lines.jsx component
export default class VisualisationSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInternalsSection: false,
    };
    this.memoryEl = React.createRef();
  }

  // shouldComponentUpdate(nextProps) {
  //   return (this.props.internalsGraph !== nextProps.internalsGraph)
  //   || (this.props.memoryGraph !== nextProps.memoryGraph);
  // }

  componentDidMount() {
  }

  componentDidUpdate() {
    const {
      referenceEdges: internalReferenceEdges,
    } = this.props.internalsGraph;
    const {
      referenceEdges,
    } = this.props.memoryGraph || {};
    const { height } = this.memoryEl.current.getBoundingClientRect();

    const SVGContainerNode = this.svgContainer.current;
    // remove all lines before drawing new ones
    removeAllDOMChildNodes(SVGContainerNode);
    if (referenceEdges) this.drawReferenceLines(referenceEdges);
    this.drawReferenceLines(internalReferenceEdges);
    for (const line of this.varLines) {
      this.drawSingleLine(line);
    }
    this.varLines = [];
  }

  // drawReferenceLines(referenceMap) {
  //   const refKeys = referenceMap.keys();
  //   for (const objectPropMap of refKeys) {
  //     const [object, prop] = objectPropMap;
  //     const value = referenceMap.get(objectPropMap);
  //     const objectInfo = getLastSymbolValue(object);
  //     const valueObjectInfo = getLastSymbolValue(value);
  //     const dot1 = objectInfo.referenceProps[prop];
  //     const dot2 = valueObjectInfo.refDot;
  //     if (objectInfo.isDisplayed && valueObjectInfo.isDisplayed && dot1 && dot2) {
  //       const line = createSVGLine(dot1, dot2, { stroke: '#FAC863', strokeWidth: '2px' });
  //       this.drawSingleLine(line);
  //     }
  //   }
  // }

  // drawSingleLine(line) {
  //   if (line) this.svgContainer.current.appendChild(line);
  // }

  // addVarLine(line) {
  //   this.varLines.push(line);
  // }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    const {
      memoryGraph, globals, internalGlobals,
    } = this.props;
    return (
      <FlexContainer column relative height={100} overflow_y="auto">
        <FlexItem basis="auto" ref={this.scriptMemorySection}>
          <Memory
            memoryGraph={memoryGraph}
            globals={globals}
            internalGlobals={internalGlobals}
          />
        </FlexItem>
      </FlexContainer>
    );
  }
}
VisualisationSection.propTypes = {
  memoryGraph: PropTypes.exact({
    V: PropTypes.arrayOf(PropTypes.any),
    referenceEdges: PropTypes.instanceOf(Map),
    objectsInfoMap: PropTypes.instanceOf(Map),
  }),
  globals: PropTypes.objectOf(PropTypes.any),
  internalGlobals: PropTypes.objectOf(PropTypes.any),
};
