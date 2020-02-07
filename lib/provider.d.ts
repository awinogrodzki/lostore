import { StoreContext, StoreProviderProps } from './types';
import * as React from 'react';
export declare const createStoreProvider: <S extends any>(StoreContext: StoreContext<S>, initialState: S) => React.FunctionComponent<StoreProviderProps<S>>;
