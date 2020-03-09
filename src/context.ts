import { createContext } from 'react';
import { StoreContextValue } from './types';
import { Store } from './store';

export const createStoreContext = <S extends any>(initialState: S) => {
  return createContext<StoreContextValue<S>>({
    state: initialState,
    get store(): Store<S> {
      throw new Error(
        'StoreContext used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.'
      );
    },
  });
};
