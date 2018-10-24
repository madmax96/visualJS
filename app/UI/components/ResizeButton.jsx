import styled from 'styled-components';
import React from 'react';

const Wrapper = styled.div`
  width:20px;
  height:35px;
  position:relative;
  display:flex;
  justify-content:center;
  cursor:col-resize;
  opacity:0.5;
`;
const Lines = styled.div`
  width:2px;
  height:100%;
  background-color:burlywood;
  &::before{
    content:"";
    position:absolute;
    width:2px;
    height:100%;
    background-color:burlywood;
    left:1px;
  }
  &::after{
    content:"";
    position:absolute;
    width:2px;
    height:100%;
    background-color:burlywood;
    right:1px;
  }
`;

export default props => (<Wrapper {...props}><Lines /></Wrapper>);
