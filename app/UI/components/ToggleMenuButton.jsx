import styled from 'styled-components';
import React from 'react';

const Arrows = styled.svg`
  fill:burlywood;
  cursor:pointer;
  width:30px;
  height:30px;
  opacity:.3;
  transition:all .3s;
  &:hover{
    opacity:1;
  }
`;

export default props => (
  <Arrows
    {...props}
    version="1.1"
    id="arrows"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 459 459"
    xmlSpace="preserve"
  >
    <g>
      <g>
        <path d="M331.5,357V178.5h-51V357H204l102,102l102-102H331.5z M153,0L51,102h76.5v178.5h51V102H255L153,0z" />
      </g>
    </g>
  </Arrows>
);
