import React from 'react';
import styled from 'styled-components';

export const ObjectNodeUI = styled.div`
  /* background: white;
  z-index:2; */
`;

export const KeyValue = styled.span`
    margin:0;
    padding:0;
    font-size:10px;
    display:flex;
    align-items:center;
`;
KeyValue.Key = styled.span`
    font-size:11px;
    font-weight:bold;
    margin-right:4px;
    color:#7FAFFC;
`;
const PairsWrapper = styled.div`
    padding-left:15px;
`;

const ObjectIconsCommon = styled.svg`
    width:10px;
    height:10px;
`;
const StyledF = styled(ObjectIconsCommon)`
    fill:#4367B2;
`;
const ObjectBracket = styled(ObjectIconsCommon)`
    fill:#60DAFB;
`;
const ArrayBracket = styled(ObjectIconsCommon)`
    fill:#4CAF50;
`;

const SvgF = () => (
  <StyledF
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 96.124 96.123"
    xmlSpace="preserve"
  >
    <g>
      <path d="M72.089,0.02L59.624,0C45.62,0,36.57,9.285,36.57,23.656v10.907H24.037c-1.083,0-1.96,0.878-1.96,1.961v15.803
c0,1.083,0.878,1.96,1.96,1.96h12.533v39.876c0,1.083,0.877,1.96,1.96,1.96h16.352c1.083,0,1.96-0.878,1.96-1.96V54.287h14.654
c1.083,0,1.96-0.877,1.96-1.96l0.006-15.803c0-0.52-0.207-1.018-0.574-1.386c-0.367-0.368-0.867-0.575-1.387-0.575H56.842v-9.246
c0-4.444,1.059-6.7,6.848-6.7l8.397-0.003c1.082,0,1.959-0.878,1.959-1.96V1.98C74.046,0.899,73.17,0.022,72.089,0.02z"
      />
    </g>
  </StyledF>
);

const ObjectLeftBracket = () => (
  <ObjectBracket
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    version="1.1"
    viewBox="0 0 16 16"
    xmlSpace="preserve"
  >
    <path d="M2.1 3.1c0.2 1.3 0.4 1.6 0.4 2.9 0 0.8-1.5 1.5-1.5 1.5v1c0 0 1.5 0.7 1.5 1.5 0 1.3-0.2 1.6-0.4 2.9-0.3 2.1 0.8 3.1 1.8 3.1s2.1 0 2.1 0v-2c0 0-1.8 0.2-1.8-1 0-0.9 0.2-0.9 0.4-2.9 0.1-0.9-0.5-1.6-1.1-2.1 0.6-0.5 1.2-1.1 1.1-2-0.3-2-0.4-2-0.4-2.9 0-1.2 1.8-1.1 1.8-1.1v-2c0 0-1 0-2.1 0s-2.1 1-1.8 3.1z" />
  </ObjectBracket>
);

const ObjectRightBracket = () => (
  <ObjectBracket
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    version="1.1"
    viewBox="0 0 16 16"
    xmlSpace="preserve"
  >
    <path d="M13.9 3.1c-0.2 1.3-0.4 1.6-0.4 2.9 0 0.8 1.5 1.5 1.5 1.5v1c0 0-1.5 0.7-1.5 1.5 0 1.3 0.2 1.6 0.4 2.9 0.3 2.1-0.8 3.1-1.8 3.1s-2.1 0-2.1 0v-2c0 0 1.8 0.2 1.8-1 0-0.9-0.2-0.9-0.4-2.9-0.1-0.9 0.5-1.6 1.1-2.1-0.6-0.5-1.2-1.1-1.1-2 0.2-2 0.4-2 0.4-2.9 0-1.2-1.8-1.1-1.8-1.1v-2c0 0 1 0 2.1 0s2.1 1 1.8 3.1z" />
  </ObjectBracket>
);


const ArrayLeftBracket = () => (
  <ArrayBracket
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    version="1.1"
    viewBox="0 0 133.986 133.986"
    xmlSpace="preserve"
  >
    <path d="M51.158,14.617c4.037,0,7.309-3.271,7.309-7.308S55.196,0,51.158,0H36.542c-4.037,0-7.309,3.272-7.309,7.309V126.68
c0,4.034,3.271,7.307,7.309,7.307h14.616c4.037,0,7.309-3.271,7.309-7.307c0-4.037-3.271-7.31-7.309-7.31h-7.308V14.617H51.158z"
    />
  </ArrayBracket>
);

const ArrayRightBracket = () => (
  <ArrayBracket
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    version="1.1"
    viewBox="0 0 133.986 133.986"
    xmlSpace="preserve"
  >
    <path d="M82.829,119.37c-4.037,0-7.31,3.271-7.31,7.31c0,4.034,3.272,7.307,7.31,7.307h14.615c4.037,0,7.309-3.271,7.309-7.307
V7.309c0-4.037-3.271-7.309-7.309-7.309H82.829c-4.037,0-7.31,3.272-7.31,7.309s3.272,7.308,7.31,7.308h7.307V119.37H82.829z"
    />
  </ArrayBracket>
);

const ObjectContainer = styled.div`
    &:hover{
       svg{
        width:13px;
        height:13px;
       }
        cursor:pointer;
        background-color:#ECECEC;
    }
    padding:5px;
`;
export const Function = props => (
  <ObjectContainer>
    <SvgF />
    <PairsWrapper>
      {props.children}
    </PairsWrapper>
  </ObjectContainer>
);

export const Obj = props => (
  <ObjectContainer>
    <ObjectLeftBracket />
    <PairsWrapper>
      {props.children}
    </PairsWrapper>
    <ObjectRightBracket />
  </ObjectContainer>
);

export const Array = props => (
  <ObjectContainer>
    <ArrayLeftBracket />
    <PairsWrapper>
      {props.children}
    </PairsWrapper>
    <ArrayRightBracket />
  </ObjectContainer>
);
