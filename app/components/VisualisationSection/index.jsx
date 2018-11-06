import React, { Component } from 'react';
import StartButton from './StartButton';
import { FlexContainer, FlexItem } from '../../UI/Layout';
import Internals from './Internals';

export default class VisualisationSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <FlexContainer column relative height={100}>
        <FlexItem basis={20}>
          <Internals />
        </FlexItem>
        <FlexItem basis={80} relative>
          <FlexItem absoluteCenter>
            <StartButton />
          </FlexItem>
        </FlexItem>
      </FlexContainer>
    );
  }
}
