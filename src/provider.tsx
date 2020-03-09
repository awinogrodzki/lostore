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

export const createStoreProvider = <S extends any, T>(StoreContext: StoreContext<S>) => {
  const MemoizedStoreProvider = React.memo<StoreContextValue<S> & { children: React.ReactNode }>(
    ({ state, store, children }) => {
      return <StoreContext.Provider value={{ state, store }}>{children}</StoreContext.Provider>;
    },
    (prevProps, nextProps) =>
      isStateEqual(prevProps.state, nextProps.state) && nextProps.store === prevProps.store
  );

  const StoreProvider: React.FunctionComponent<StoreProviderProps<S>> = ({ children, store }) => {
    const [state, setState] = React.useState(store.getState());
    const onStateUpdate = (state: S) => setState(state);

    React.useEffect(() => {
      const unsubscribe = store.subscribe(onStateUpdate);

      return () => {
        unsubscribe();
      };
    }, [store]);

    return (
      <MemoizedStoreProvider state={state} store={store}>
        {children}
      </MemoizedStoreProvider>
    );
  };

  return StoreProvider;
};
