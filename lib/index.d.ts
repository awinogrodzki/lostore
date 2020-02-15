import * as React from 'react';
import { ActionReducers, Actions, StoreContext, StoreProviderProps } from './types';
declare type MapStateToProps<S, P> = (state: S) => P;
declare type MapActionsToProps<S, T extends ActionReducers<S, T>, P> = (actions: Actions<S, T>) => P;
export declare const createStoreHook: <S, T extends ActionReducers<S, T, S>>(reducers: T, initialState: S, StoreContext?: StoreContext<S>, StoreProvider?: React.FunctionComponent<StoreProviderProps<S>>) => {
    StoreProvider: React.FunctionComponent<StoreProviderProps<S>>;
    useStore: () => [S, Actions<S, T, S>];
    connectStore: <SP, AP>(mapStateToProps: MapStateToProps<S, SP>, mapActionsToProps: MapActionsToProps<S, T, AP>) => <C extends React.FunctionComponent<{}>, P = C extends React.FunctionComponent<infer CP> ? CP : never>(Component: C) => (props: Pick<P, Exclude<keyof P, keyof SP | keyof AP>>) => JSX.Element;
};
export {};
