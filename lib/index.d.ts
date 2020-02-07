import * as React from 'react';
import { ActionReducerCreator, ActionReducers, Actions, StoreContext, StoreProviderProps } from './types';
export declare const createStoreHook: <S, T extends {
    [type: string]: ActionReducerCreator<S, any>;
}>(reducers: ActionReducers<S, T>, initialState: S, StoreContext?: StoreContext<S>, StoreProvider?: React.FunctionComponent<StoreProviderProps<S>>) => [React.FunctionComponent<StoreProviderProps<S>>, () => [S, Actions<S, T>]];
