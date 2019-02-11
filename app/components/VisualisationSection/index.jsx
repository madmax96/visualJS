import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexContainer, FlexItem } from '../../UI/Layout';
import { SvgContainer } from '../../UI/components/ObjectVisualisation';
import getLastSymbolValue from '../../utils/getLastSymbolValue';
import createSVGLine from '../../utils/createSVGLine';
import Memory from './Memory';


/**
  *implement ref. lines for variables --> DONE
  *fix some prop types --> DONE
  *implement shrink --> DONE
  *show only currently visible objects -->DONE
  *implement expand on click and showing all objects -->DONE
  *refactor code state management --> DONE
  *implement recursive hiding of objects (only if object have one reference):
    -Problem here is when nested object has reference to its parent, like prototype-constructor connection
    - Another problem is when in boject 2 or more properties are references to the same object
  *implement redrawing on resize event
  *implement drag/drop
  *implement closure detection
  *styling and design,UX
  *responsive design
  *displaying prototype chain for some object!
  *'show all prototypes' button ???
*/


export default class VisualisationSection extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.varLines = [];
    this.internalsSection = React.createRef();
    this.scriptMemorySection = React.createRef();
    this.svgContainer = React.createRef();
    this.drawSingleLine = this.drawSingleLine.bind(this);
    this.drawReferenceLines = this.drawReferenceLines.bind(this);
    this.addVarLine = this.addVarLine.bind(this);
  }

  // shouldComponentUpdate(nextProps) {
  //   return (this.props.internalsGraph !== nextProps.internalsGraph)
  //   || (this.props.memoryGraph !== nextProps.memoryGraph);
  // }

  componentDidUpdate() {
    const {
      referenceEdges: internalReferenceEdges,
    } = this.props.internalsGraph;
    const {
      referenceEdges,
    } = this.props.memoryGraph || {};
    const { height: internalsHeight } = this.internalsSection.current.getBoundingClientRect();
    const { height: scriptMemoryHeight } = this.scriptMemorySection.current.getBoundingClientRect();
    const totalSvgContainerHeight = internalsHeight + scriptMemoryHeight;
    this.svgContainer.current.setAttribute('height', totalSvgContainerHeight);

    const SVGContainerNode = this.svgContainer.current;
    // remove all lines before drawing new ones
    let fc = SVGContainerNode.firstChild;
    while (fc) {
      SVGContainerNode.removeChild(fc);
      fc = SVGContainerNode.firstChild;
    }
    if (referenceEdges) this.drawReferenceLines(referenceEdges);
    this.drawReferenceLines(internalReferenceEdges);
    for (const line of this.varLines) {
      this.drawSingleLine(line);
    }
    this.varLines = [];
  }

  drawReferenceLines(referenceMap) {
    const refKeys = referenceMap.keys();
    for (const objectPropMap of refKeys) {
      const [object, prop] = objectPropMap;
      const value = referenceMap.get(objectPropMap);
      const objectInfo = getLastSymbolValue(object);
      const valueObjectInfo = getLastSymbolValue(value);
      const dot1 = objectInfo.referenceProps[prop];
      const dot2 = valueObjectInfo.refDot;
      if (objectInfo.isDisplayed && valueObjectInfo.isDisplayed && dot1 && dot2) {
        const line = createSVGLine(dot1, dot2, { stroke: '#FAC863', strokeWidth: '2px' });
        this.drawSingleLine(line);
      }
    }
  }

  drawSingleLine(line) {
    if (line) this.svgContainer.current.appendChild(line);
  }

  addVarLine(line) {
    this.varLines.push(line);
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    const {
      internalsGraph, memoryGraph, globals, internalGlobals, redraw,
    } = this.props;
    return (
      <FlexContainer column relative height={100} overflow_y="auto">
        <SvgContainer ref={this.svgContainer} />
        <FlexItem basis="auto" ref={this.internalsSection}>
          <Memory
            addVarLine={line => this.addVarLine(line)}
            memoryGraph={internalsGraph}
            globals={internalGlobals}
            drawSingleLine={line => this.drawSingleLine(line)}
            redraw={redraw}
          />
        </FlexItem>
        <FlexItem basis="auto" ref={this.scriptMemorySection}>
          {memoryGraph ? (
            <Memory
              addVarLine={line => this.addVarLine(line)}
              memoryGraph={memoryGraph}
              globals={globals}
              drawSingleLine={line => this.drawSingleLine(line)}
              redraw={redraw}

            />
          ) : (
            <p>Visualise Anything</p>
          )}
        </FlexItem>
      </FlexContainer>
    );
  }
}
VisualisationSection.propTypes = {
  internalsGraph: PropTypes.exact({
    V: PropTypes.arrayOf(PropTypes.any),
    referenceEdges: PropTypes.instanceOf(Map),
  }),
  memoryGraph: PropTypes.exact({
    V: PropTypes.arrayOf(PropTypes.any),
    referenceEdges: PropTypes.instanceOf(Map),
  }),
  globals: PropTypes.objectOf(PropTypes.any),
  internalGlobals: PropTypes.objectOf(PropTypes.any),
};
