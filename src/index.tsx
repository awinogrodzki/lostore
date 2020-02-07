import * as React from 'react';
import {
  ActionReducerCreator,
  ActionReducers,
  Actions,
  ActionReducer,
  StoreContext,
  StoreProviderProps,
  AsyncActionReducer,
} from './types';
import { createStoreContext } from './context';
import { createStoreProvider } from './provider';

const getResultFromAsyncReducer = async <S extends any>(
  state: S,
  reducerPromise: AsyncActionReducer<S>
): Promise<S> => {
  const reducer = await reducerPromise;
  const result = reducer(state);

  if (result instanceof Promise) {
    return await result;
  }

  return result;
};

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

          const setStateIfChanged = (value: S) => {
            if (value === state) {
              return;
            }

            setState(value);
          };

          if (reducer instanceof Promise) {
            return getResultFromAsyncReducer(state, reducer).then(result => {
              setStateIfChanged(result);
            });
          }

          const result = reducer(state);

          if (result instanceof Promise) {
            return result.then(value => setStateIfChanged(value));
          }

          setStateIfChanged(result);
        },
      }),
      {} as Actions<S, T>
    );

    return [state, actions];
  };

  return [StoreProvider, useStore] as [typeof StoreProvider, typeof useStore];
};
