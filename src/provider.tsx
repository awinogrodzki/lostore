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

const isCallback = <S extends any>(
  callback: React.SetStateAction<S>
): callback is (prevState: S) => S => typeof callback === 'function';

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
    prerenderedState,
    onUpdate,
  }) => {
    const [state, setState] = React.useState(prerenderedState ?? initialState);
    const handleUpdate = (state: S) => {
      if (typeof onUpdate !== 'function') {
        return;
      }

      onUpdate(state);
    };

    const handleSetState = (callback: React.SetStateAction<S>) => {
      setState(prevState => {
        if (isCallback(callback)) {
          const newState = callback(prevState);
          handleUpdate(newState);
          return newState;
        }

        handleUpdate(callback);
        return callback;
      });
    };

    return (
      <MemoizedStoreProvider state={state} setState={handleSetState}>
        {children}
      </MemoizedStoreProvider>
    );
  };

  return StoreProvider;
};
