import * as React from 'react';
import {
  ActionReducers,
  Actions,
  ActionReducer,
  StoreContext,
  StoreProviderProps,
  ActionReducerCreator,
  ActionCreator,
  SetState,
  PromiseOrVoid,
} from './types';
import { createStoreContext } from './context';
import { createStoreProvider } from './provider';

const mapReducerCreatorToAction = <S extends any, T extends ActionReducerCreator<S, RS>, RS = S>(
  reducerCreator: T,
  setState: SetState<S, RS>
): ActionCreator<T> => {
  return (...args: Parameters<T>): PromiseOrVoid<T> => {
    const reducer: ActionReducer<S, RS> | Promise<ActionReducer<S, RS>> = reducerCreator(...args);

    if (reducer instanceof Promise) {
      return reducer.then(reducerFromPromise => {
        setState((currentState, rootState) => reducerFromPromise(currentState, rootState));
      }) as PromiseOrVoid<T>;
    }

    setState((currentState, rootState) => reducer(currentState, rootState));
    return undefined as PromiseOrVoid<T>;
  };
};

const mapReducersToActions = <S, RS, T>(
  actions: Actions<S, T>,
  typeOrGroupKey: string,
  reducerCreatorOrReducers: ActionReducerCreator | ActionReducers,
  setState: SetState<S, RS>
): Actions<S, T> => {
  if (typeof reducerCreatorOrReducers === 'function') {
    return {
      ...actions,
      [typeOrGroupKey]: mapReducerCreatorToAction(reducerCreatorOrReducers, setState),
    };
  }

  const setChildState = (key: string) => (callback: (prevState: S, rootState: RS) => S) => {
    setState((prevState, rootState) => {
      return { ...prevState, [key]: callback(prevState[key], rootState) };
    });
  };

  return {
    ...actions,
    [typeOrGroupKey]: Object.entries(reducerCreatorOrReducers).reduce(
      (childActions, [key, value]) =>
        mapReducersToActions(childActions, key, value, setChildState(typeOrGroupKey)),
      {}
    ),
  };
};

type MapStateToProps<S, P> = (state: S) => P;
type MapActionsToProps<S, T extends ActionReducers<S, T>, P> = (actions: Actions<S, T>) => P;

type ExcludeFromProps<P extends {}, EP extends {}> = Pick<P, Exclude<keyof P, keyof EP>>;

export const createStoreHook = <S, T extends ActionReducers<S, T>>(
  reducers: T,
  initialState: S,
  StoreContext: StoreContext<S> = createStoreContext(initialState),
  StoreProvider: React.FunctionComponent<StoreProviderProps<S>> = createStoreProvider(
    StoreContext,
    initialState
  )
) => {
  const useStore = (): [S, Actions<S, T>] => {
    const { state, setState } = React.useContext(StoreContext);

    const actions = Object.entries<ActionReducerCreator | ActionReducers>(reducers).reduce(
      (aggr, [key, value]) =>
        mapReducersToActions(aggr, key, value, callback => {
          setState(prevState => callback(prevState, prevState));
        }),

      {} as Actions<S, T>
    );

    return [state, actions];
  };

  const connectStore = <SP, AP>(
    mapStateToProps: MapStateToProps<S, SP>,
    mapActionsToProps: MapActionsToProps<S, T, AP>
  ) => <
    C extends React.FunctionComponent,
    P = C extends React.FunctionComponent<infer CP> ? CP : never
  >(
    Component: C
  ) => {
    const MemoizedComponent = React.memo(Component);
    type PropsWithoutActionAndStateProps = ExcludeFromProps<P, SP & AP>;

    const ComponentContainer = (props: PropsWithoutActionAndStateProps) => {
      const [state, actions] = useStore();
      const stateProps = mapStateToProps(state);
      const actionProps = mapActionsToProps(actions);

      return <MemoizedComponent {...props} {...stateProps} {...actionProps} />;
    };

    return ComponentContainer;
  };

  return { StoreProvider, useStore, connectStore };
};
