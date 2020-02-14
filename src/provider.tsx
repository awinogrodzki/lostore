import { StoreContext, StoreProviderProps, StoreContextValue } from './types';
import * as React from 'react';
import { isObjectLiteral } from './utils';

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

export const createStoreProvider = <S extends any>(
  StoreContext: StoreContext<S>,
  initialState: S
) => {
  const MemoizedStoreProvider = React.memo<StoreContextValue<S> & { children: React.ReactNode }>(
    ({ state, setState, children }) => {
      return <StoreContext.Provider value={{ state, setState }}>{children}</StoreContext.Provider>;
    },
    (prevProps, nextProps) => isStateEqual(prevProps.state, nextProps.state)
  );

  const StoreProvider: React.FunctionComponent<StoreProviderProps<S>> = ({
    children,
    initialState: initialStateFromProps,
  }) => {
    const [state, setState] = React.useState(initialStateFromProps ?? initialState);

    return (
      <MemoizedStoreProvider state={state} setState={setState}>
        {children}
      </MemoizedStoreProvider>
    );
  };

  return StoreProvider;
};
