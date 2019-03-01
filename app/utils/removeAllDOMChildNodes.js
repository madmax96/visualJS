export default (parentDOM) => {
  if (!parentDOM) return;
  let fc = parentDOM.firstChild;
  while (fc) {
    parentDOM.removeChild(fc);
    fc = parentDOM.firstChild;
  }
};
