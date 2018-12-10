import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlexContainer, FlexItem } from '../../UI/Layout';
import { SvgContainer } from '../../UI/components/ObjectVisualisation';
import Memory from './Memory';

export default class VisualisationSection extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.internalsSection = React.createRef();
    this.scriptMemorySection = React.createRef();
    this.svgContainer = React.createRef();
    this.drawLine = this.drawLine.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.internalsGraph !== nextProps.internalsGraph)
    || (this.props.memoryGraph !== nextProps.memoryGraph);
  }

  componentDidUpdate() {
    const {
      prototypeEdges: internalsPrototypeEdges,
      referenceEdges: internalsReferenceEdges,
    } = this.props.internalsGraph;

    const { height: internalsHeight } = this.internalsSection.current.getBoundingClientRect();
    const { height: scriptMemoryHeight } = this.scriptMemorySection.current.getBoundingClientRect();
    const totalSvgContainerHeight = internalsHeight + scriptMemoryHeight;
    this.svgContainer.current.setAttribute('height', totalSvgContainerHeight);
    const drawPrototypeLine = (map) => {
      const object = map.keys().next().value;
      const { $$x: x1, $$y: y1 } = object;
      const objectPrototype = map.get(object);
      const { $$x: x2, $$y: y2 } = objectPrototype;

      const newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line'); // Create a path in SVG's namespace
      newLine.setAttribute('x1', x1);
      newLine.setAttribute('y1', y1);
      newLine.setAttribute('x2', x2);
      newLine.setAttribute('y2', y2);
      newLine.style.stroke = '#FAC863'; // Set stroke colour
      newLine.style.strokeWidth = '2px';
      this.svgContainer.current.appendChild(newLine);
    };
    internalsReferenceEdges.forEach((edge) => {
      // ???
      const objectPropMap = edge.keys().next().value;
      const key = objectPropMap.keys().next();
      console.log(key);
    });
    // internalsPrototypeEdges.forEach(drawPrototypeLine);

    // if (this.props.memoryGraph) {
    //   const { prototypeEdges: scriptMemoryPrototypeEdges } = this.props.memoryGraph;
    //   scriptMemoryPrototypeEdges.forEach(drawPrototypeLine);
    // }
  }

  drawLine(line) {
    this.svgContainer.current.appendChild(line);
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    const {
      internalsGraph, memoryGraph, globals, internalGlobals,
    } = this.props;
    return (
      <FlexContainer column relative height={100} overflow_y="auto">
        <SvgContainer innerRef={this.svgContainer} />
        <FlexItem basis="auto" innerRef={this.internalsSection}>
          <Memory
            memoryGraph={internalsGraph}
            globals={internalGlobals}
            drawLine={line => this.drawLine(line)}
          />
        </FlexItem>
        <FlexItem basis="auto" innerRef={this.scriptMemorySection}>
          {memoryGraph ? (
            <Memory
              memoryGraph={memoryGraph}
              globals={globals}
              drawLine={line => this.drawLine(line)}
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
    referenceEdges: PropTypes.arrayOf(PropTypes.instanceOf(Map)),
    prototypeEdges: PropTypes.arrayOf(PropTypes.instanceOf(Map)),
  }),
  memoryGraph: PropTypes.exact({
    V: PropTypes.arrayOf(PropTypes.any),
    referenceEdges: PropTypes.arrayOf(PropTypes.instanceOf(Map)),
    prototypeEdges: PropTypes.arrayOf(PropTypes.instanceOf(Map)),
  }),
  globals: PropTypes.objectOf(PropTypes.any),
  internalGlobals: PropTypes.objectOf(PropTypes.any),
};
