import * as React from 'react';
import {
  ActionReducers,
  Actions,
  ActionReducer,
  ActionReducerCreator,
  ActionCreator,
  PromiseOrVoid,
} from './types';
import { createStoreContext } from './context';
import { createStoreProvider } from './provider';
import { createStore, Store } from './store';

const mapReducerCreatorToAction = <S, T extends ActionReducerCreator<S>>(
  reducerCreator: T,
  store: Store<S>
): ActionCreator<T> => {
  return (...args: Parameters<T>): PromiseOrVoid<T> => {
    const reducer: ActionReducer<S> | Promise<ActionReducer<S>> = reducerCreator(...args);

    if (reducer instanceof Promise) {
      return reducer.then(reducerFromPromise => {
        store.setState(reducerFromPromise(store.getState()));
      }) as PromiseOrVoid<T>;
    }

    store.setState(reducer(store.getState()));
    return undefined as PromiseOrVoid<T>;
  };
};

const mapReducersToActions = <S, T extends ActionReducers<S>>(
  actions: Actions<S, T>,
  typeOrGroupKey: string,
  reducerCreator: ActionReducerCreator<S>,
  store: Store<S>
): Actions<S, T> => {
  return {
    ...actions,
    [typeOrGroupKey]: mapReducerCreatorToAction(reducerCreator, store),
  };
};

type MapStateToProps<S, P, OP> = (state: S, ownProps: OP) => P;
type MapActionsToProps<S, T extends ActionReducers<S, T>, P, OP> = (
  actions: Actions<S, T>,
  ownProps: OP
) => P;

type ExcludeFromProps<P extends {}, EP extends {}> = Pick<P, Exclude<keyof P, keyof EP>>;
type OwnProps<P, SP, AP> = ExcludeFromProps<P, AP & SP>;

export const createHookStore = <S, T extends ActionReducers<S, T>>(
  reducers: T,
  initialState: S
) => {
  const StoreContext = createStoreContext();
  const StoreProvider = createStoreProvider(StoreContext);
  const useStore = (): [S, Actions<S, T>, Store<S>] => {
    const { state, store } = React.useContext(StoreContext);

    const actions = Object.entries<ActionReducerCreator<S>>(reducers).reduce(
      (aggr, [key, value]) => mapReducersToActions(aggr, key, value, store),
      {} as Actions<S, T>
    );

    return [state, actions, store];
  };

  const connectStore = <
    SP extends Partial<P>,
    AP extends Partial<P>,
    OP extends Partial<P>,
    P extends {} = SP & AP & OP
  >(
    mapStateToProps: MapStateToProps<S, SP, OP>,
    mapActionsToProps: MapActionsToProps<S, T, AP, OP>,
    propsAreEqual?: (prevProps: P, nextProps: P) => boolean
  ) => (Component: React.FunctionComponent<P>) => {
    const MemoizedComponent = React.memo(Component, propsAreEqual);

    return (props: OwnProps<P, SP, AP>) => {
      const [state, actions] = useStore();
      const stateProps = mapStateToProps(state, props as OP);
      const actionProps = mapActionsToProps(actions, props as OP);

      return <MemoizedComponent {...(props as P)} {...stateProps} {...actionProps} />;
    };
  };

  return {
    StoreContext,
    StoreProvider,
    useStore,
    connectStore,
    createStore: (prerenderedState: S = initialState) => {
      return createStore(prerenderedState);
    },
  };
};
