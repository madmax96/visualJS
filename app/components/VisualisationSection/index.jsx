import React, { Component } from 'react';
import StartButton from './StartButton';
import { FlexContainer, FlexItem, Position } from '../../UI/Layout';
import Internals from './Internals';

export default class VisualisationSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <FlexContainer column height={100}>
        <FlexItem basis={20}>
          <Internals />
        </FlexItem>
        <FlexItem basis={80} relative>
          <Position absoluteCenter>
            <StartButton />
          </Position>
        </FlexItem>
      </FlexContainer>
    );
  }
}
