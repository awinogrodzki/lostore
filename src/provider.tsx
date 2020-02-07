import { StoreContext, StoreProviderProps } from './types';
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

    return <StoreContext.Provider value={{ state, setState }}>{children}</StoreContext.Provider>;
  };

  return StoreProvider;
};
