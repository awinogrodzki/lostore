import { createContext } from "react";
import { StoreContextValue } from "./types";

export const createStoreContext = <S extends any>(initialState: S) => {
  return createContext<StoreContextValue<S>>({
    state: initialState,
    setState: () => {
      throw new Error(
        'useStore hook used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.'
      );
    },
  });
}