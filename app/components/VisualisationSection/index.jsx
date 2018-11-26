import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../UI/components/StartButton';

import { FlexContainer, FlexItem } from '../../UI/Layout';
import Memory from './Memory';

export default class VisualisationSection extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.internalsGraph !== nextProps.internalsGraph)
    || (this.props.memoryGraph !== nextProps.memoryGraph);
  }

  componentDidUpdate() {
    const { V } = this.props.internalsGraph;
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
        <FlexItem basis="auto">
          <Memory memoryGraph={internalsGraph} globals={internalGlobals} />
        </FlexItem>
        <FlexItem basis="auto">
          {memoryGraph ? <Memory memoryGraph={memoryGraph} globals={globals} /> : (
            <FlexItem absoluteCenter>
              <Button onClick={this.props.visualise}>
                Start magic
              </Button>
            </FlexItem>
          )}

        </FlexItem>
      </FlexContainer>
    );
  }
}
VisualisationSection.propTypes = {
  visualise: PropTypes.func.isRequired,
};
