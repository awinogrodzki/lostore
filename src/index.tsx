import * as React from 'react';

export type ActionReducer<S> = (state: S) => S;
export type ActionReducerCreator<
  S,
  T extends (...args: any[]) => ActionReducer<S> | Promise<ActionReducer<S>>
> = (...args: Parameters<T>) => ReturnType<T>;
export type ActionReducers<S, T extends { [type: string]: ActionReducerCreator<S, any> }> = {
  [K in keyof T]: T[K];
};

export type Actions<S, T extends ActionReducers<S, any>> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => void;
};

export interface StoreProviderProps<S> {
  initialState?: S
}

export const createStoreHook = <S, T extends { [type: string]: ActionReducerCreator<S, any> }>(
  reducers: ActionReducers<S, T>,
  initialState: S
) => {
  const StoreContext = React.createContext<{
    state: S;
    setState: React.Dispatch<React.SetStateAction<S>>;
  }>({
    state: initialState,
    setState: () => {
      throw new Error(
        'useStore hook used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.'
      );
    },
  });

  const StoreProvider: React.FunctionComponent<StoreProviderProps<S>> = ({ children, initialState: initialStateFromProps }) => {
    const [state, setState] = React.useState(initialStateFromProps ?? initialState);

    return <StoreContext.Provider value={{ state, setState }}>{children}</StoreContext.Provider>;
  };

  const useStore = (): [S, Actions<S, T>] => {
    const { state, setState } = React.useContext(StoreContext);

    const actions = Object.entries(reducers).reduce<Actions<S, T>>(
      (actions, [actionType, reducerCreator]) => ({
        ...actions,
        [actionType]: async (...args) => {
          const reducer: ActionReducer<S> | Promise<ActionReducer<S>> = reducerCreator(...args);
          let result: S;

          if (reducer instanceof Promise) {
            const reducerFromPromise = await reducer;
            result = reducerFromPromise(state);
          } else {
            result = reducer(state);
          }

          if (result instanceof Promise) {
            setState(await result);
            return;
          }

          setState(result);
        },
      }),
      {} as Actions<S, T>
    );

    return [state, actions];
  };

  return [StoreProvider, useStore] as [typeof StoreProvider, typeof useStore];
};
