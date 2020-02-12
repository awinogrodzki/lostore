export const isObjectLiteral = (value: any): value is object =>
  Object.prototype.toString.call(value) === '[object Object]';
