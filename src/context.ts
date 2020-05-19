import { createContext } from 'react';
import { StoreContextValue } from './types';
import { Store } from './store';

export const createStoreContext = <S extends any>() => {
  return createContext<StoreContextValue<S>>({
    get state(): S {
      throw new Error(
        'StoreContext used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.'
      );
    },
    get store(): Store<S> {
      throw new Error(
        'StoreContext used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.'
      );
    },
  });
};
