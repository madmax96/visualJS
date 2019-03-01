export default (dot1, dot2, { stroke, strokeWidth }) => {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); // Create a path in SVG's namespace
  const { x, y } = dot1;
  const { x: x1, y: y1 } = dot2;
  if (!(Number.isInteger(x)
        && Number.isInteger(y)
        && Number.isInteger(x1) && Number.isInteger(y1))) return null;
  line.setAttribute('x1', x);
  line.setAttribute('y1', y);
  line.setAttribute('x2', x1);
  line.setAttribute('y2', y1);
  line.style.stroke = 'rgba(0,0,0,.1)'; // Set stroke colour
  line.style.strokeWidth = '1px';
  return line;
};
