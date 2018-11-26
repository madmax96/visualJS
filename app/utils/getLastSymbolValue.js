export default function (object) {
  const symbols = Object.getOwnPropertySymbols(object);
  const lastSymbol = symbols[symbols.length - 1];
  return object[lastSymbol];
}
