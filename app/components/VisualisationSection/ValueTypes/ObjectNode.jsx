import React from 'react';
import {
  Dot, KeyValue, Function, Obj, Array,
} from '../../../UI/components/ObjectVisualisation';
import { FlexContainer } from '../../../UI/Layout';
import { isReferenceType, isValidProp } from '../../../utils/validation';
import Primitive from './PrimitiveTypes';

const objectTypes = {
  function: keyValuePairs => <Function>{keyValuePairs}</Function>,
  object: keyValuePairs => <Obj>{keyValuePairs}</Obj>,
  array: keyValuePairs => <Array>{keyValuePairs}</Array>,
};
export default class ObjectNode extends React.Component {
  constructor(props) {
    super(props);
    this.referenceDot = React.createRef();
    this.prototypeDot = React.createRef();
  }

  componentDidMount() {
    const { x, y } = this.prototypeDot.current.getBoundingClientRect();
    this.props.object.$$x = x;
    this.props.object.$$y = y;
  }

  render() {
    const { object } = this.props;
    const keys = Object.getOwnPropertyNames(object);
    const pairs = [];
    keys.forEach((key, i) => {
      if (!isValidProp(key)) return;
      pairs.push(
        <KeyValue key={i}>
          <KeyValue.Key>
            {key}
                :
          </KeyValue.Key>
          {!isReferenceType(object[key])
            ? <Primitive value={object[key]} /> : <Dot reference />}
        </KeyValue>,
      );
    });
    let type = typeof object;
    if (window.Array.isArray(object)) type = 'array';
    return (
      <div>
        {objectTypes[type](pairs)}
        <FlexContainer justify_content="center">
          <Dot reference mr={5} innerRef={this.referenceDot} />
          <Dot innerRef={this.prototypeDot} />
        </FlexContainer>
      </div>
    );
  }
}
