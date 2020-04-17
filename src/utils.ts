export const isObjectLiteral = (value: any): value is object =>
  Object.prototype.toString.call(value) === '[object Object]';

export const isStateEqual = <S extends any>(prevState: S, nextState: S) => {
  if (prevState === nextState) {
    return true;
  }

  if (isObjectLiteral(prevState) && isObjectLiteral(nextState)) {
    const prevStatePropertiesMatch = Object.entries(prevState).every(
      ([key, value]) => nextState[key] === value
    );
    const hasTheSameLength = Object.keys(prevState).length === Object.keys(nextState).length;
    return prevStatePropertiesMatch && hasTheSameLength;
  }

  if (Array.isArray(prevState) && Array.isArray(nextState)) {
    const prevStateValuesMatch = prevState.every(
      (value: any, index: number) => value === nextState[index]
    );
    const hasTheSameLength = prevState.length === nextState.length;

    return prevStateValuesMatch && hasTheSameLength;
  }

  return false;
};
