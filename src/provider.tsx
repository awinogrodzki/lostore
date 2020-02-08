import { StoreContext, StoreProviderProps, StoreContextValue } from './types';
import * as React from 'react';

export const createStoreProvider = <S extends any>(
  StoreContext: StoreContext<S>,
  initialState: S
) => {
  const StoreProvider: React.FunctionComponent<StoreProviderProps<S>> = ({
    children,
    initialState: initialStateFromProps,
  }) => {
    const [state, setState] = React.useState(initialStateFromProps ?? initialState);

    const MemoizedStoreProvider = React.memo<StoreContextValue<S>>(({ state, setState }) => {
      return <StoreContext.Provider value={{ state, setState }}>{children}</StoreContext.Provider>;
    }, (prevProps, nextProps) => {
      if (prevProps.state !== nextProps.state) {
        return true;
      }

      return false;
    });
    
    return <MemoizedStoreProvider state={state} setState={setState} />;
  };

  return StoreProvider;
};
