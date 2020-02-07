import * as React from 'react';
import {
  ActionReducerCreator,
  ActionReducers,
  Actions,
  ActionReducer,
  StoreContext,
  StoreProviderProps,
} from './types';
import { createStoreContext } from './context';
import { createStoreProvider } from './provider';

export const createStoreHook = <S, T extends { [type: string]: ActionReducerCreator<S, any> }>(
  reducers: ActionReducers<S, T>,
  initialState: S,
  StoreContext: StoreContext<S> = createStoreContext(initialState),
  StoreProvider: React.FunctionComponent<StoreProviderProps<S>> = createStoreProvider(
    StoreContext,
    initialState
  )
) => {
  const useStore = (): [S, Actions<S, T>] => {
    const { state, setState } = React.useContext(StoreContext);

    const actions = Object.entries(reducers).reduce<Actions<S, T>>(
      (actions, [actionType, reducerCreator]) => ({
        ...actions,
        [actionType]: (...args): void | Promise<void> => {
          const reducer: ActionReducer<S> | Promise<ActionReducer<S>> = reducerCreator(...args);

          if (reducer instanceof Promise) {
            return reducer.then(reducerFromPromise => {
              setState(currentState => reducerFromPromise(currentState));
            })
          }

          setState(currentState => reducer(currentState));
        },
      }),
      {} as Actions<S, T>
    );

    return [state, actions];
  };

  return [StoreProvider, useStore] as [typeof StoreProvider, typeof useStore];
};
