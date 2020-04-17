import { StoreContext, StoreProviderProps } from './types';
import * as React from 'react';

export const createStoreProvider = <S extends any, T>(StoreContext: StoreContext<S>) => {
  const StoreProvider: React.FunctionComponent<StoreProviderProps<S>> = ({ children, store }) => {
    const [state, setState] = React.useState(store.getState());
    const onStateUpdate = (nextState: S) => {
      setState(nextState);
    };

    React.useEffect(() => {
      const unsubscribe = store.subscribe(onStateUpdate);
      setState(store.getState());

      return () => {
        unsubscribe();
      };
    }, [store]);

    return (
      <StoreContext.Provider value={{ state, store }}>{children}</StoreContext.Provider>
    );
  };

  return StoreProvider;
};
