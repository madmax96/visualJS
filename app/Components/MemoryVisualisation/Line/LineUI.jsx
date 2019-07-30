// receives 2 endpoints as props
import React from 'react';

export default ({
  x1, x2, y1, y2, stroke, strokeWidth, ...other
}) => (
  <line
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    x1={x1}
    x2={x2}
    y1={y1}
    y2={y2}
    stroke={stroke}
    strokeWidth={strokeWidth}
    {...other}
  />
);
