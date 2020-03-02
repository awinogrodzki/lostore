import * as React from 'react';
import { ActionReducers, Actions, StoreContext, StoreProviderProps } from './types';
declare type MapStateToProps<S, P, OP> = (state: S, ownProps: OP) => P;
declare type MapActionsToProps<S, T extends ActionReducers<S, T>, P, OP> = (actions: Actions<S, T>, ownProps: OP) => P;
export declare type OnUpdate<S> = (state: S) => void | Promise<void>;
export declare const createStore: <S, T extends ActionReducers<S, T, S>>(reducers: T, initialState: S, StoreContext?: StoreContext<S>, StoreProvider?: React.FunctionComponent<StoreProviderProps<S>>) => {
    StoreProvider: React.FunctionComponent<StoreProviderProps<S>>;
    useStore: (onUpdate?: OnUpdate<S> | undefined) => [S, Actions<S, T, S>];
    connectStore: <SP extends Partial<P>, AP extends Partial<P>, OP extends Partial<P>, P extends {} = SP & AP & OP>(Component: React.FunctionComponent<P>, mapStateToProps: MapStateToProps<S, SP, OP>, mapActionsToProps: MapActionsToProps<S, T, AP, OP>, propsAreEqual?: ((prevProps: P, nextProps: P) => boolean) | undefined) => (props: Pick<P, Exclude<keyof P, keyof AP | keyof SP>>) => JSX.Element;
};
export {};
