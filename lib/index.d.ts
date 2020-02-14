import * as React from 'react';
import { ActionReducers, Actions, StoreContext, StoreProviderProps } from './types';
export declare const createStoreHook: <S, T extends ActionReducers<S, T, S>>(reducers: T, initialState: S, StoreContext?: StoreContext<S>, StoreProvider?: React.FunctionComponent<StoreProviderProps<S>>) => [React.FunctionComponent<StoreProviderProps<S>>, () => [S, Actions<S, T, S>]];
