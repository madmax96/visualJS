import React from 'react';
import styled from 'styled-components';

export const SvgContainer = styled.svg`
  width:100%;
  position:absolute;
`;

export const Dot = styled.div`
    width:8px;
    height:8px;
    border-radius:50%;
    background-color:${props => (props.reference ? 'lightblue' : '#FAC863')};
    display:inline-block;
    ${(props) => {
    if (props.mr) {
      return `margin-right:${props.mr}px`;
    }
  }}
`;
