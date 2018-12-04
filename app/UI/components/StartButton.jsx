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
    viewBox="0 0 232.153 232.153"
    xmlSpace="preserve"
  >
    <g>
      <g>
        <path
          d="M203.791,99.628L49.307,2.294c-4.567-2.719-10.238-2.266-14.521-2.266
c-17.132,0-17.056,13.227-17.056,16.578v198.94c0,2.833-0.075,16.579,17.056,16.579c4.283,0,9.955,0.451,14.521-2.267
l154.483-97.333c12.68-7.545,10.489-16.449,10.489-16.449S216.471,107.172,203.791,99.628z"
        />
      </g>
    </g>
  </Arrows>
);
