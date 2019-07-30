import React from 'react';
import LineUI from './LineUI';

export default ({
  dot1, dot2, stroke, strokeWidth, onClick, onHover,
}) => {
  const { x: x1, y: y1 } = dot1;
  const { x: x2, y: y2 } = dot2;
  return (
    <LineUI
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
      stroke={stroke}
      strokeWidth={strokeWidth}
      onClick={onClick}
      onMouseOver={onHover}
      onFocus={onHover}
    />
  );
};
