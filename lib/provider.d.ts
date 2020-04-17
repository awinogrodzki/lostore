import { StoreContext, StoreProviderProps } from './types';
import * as React from 'react';
export declare const createStoreProvider: <S extends any, T>(StoreContext: StoreContext<S>) => React.FunctionComponent<StoreProviderProps<S>>;
