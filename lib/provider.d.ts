import { StoreContext, StoreProviderProps } from './types';
import * as React from 'react';
export declare const isStateEqual: <S extends any>(prevState: S, nextState: S) => boolean;
export declare const createStoreProvider: <S extends any, T>(StoreContext: StoreContext<S>) => React.FunctionComponent<StoreProviderProps<S>>;
