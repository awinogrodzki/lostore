import * as React from 'react';
export declare type ActionReducer<S> = (state: S) => S;
export declare type ActionReducerCreator<S, T extends (...args: any[]) => ActionReducer<S> | Promise<ActionReducer<S>>> = (...args: Parameters<T>) => ReturnType<T>;
export declare type ActionReducers<S, T extends {
    [type: string]: ActionReducerCreator<S, any>;
}> = {
    [K in keyof T]: T[K];
};
export declare type Actions<S, T extends ActionReducers<S, any>> = {
    [K in keyof T]: (...args: Parameters<T[K]>) => void;
};
export declare const createStoreHook: <S, T extends {
    [type: string]: ActionReducerCreator<S, any>;
}>(reducers: ActionReducers<S, T>, initialState: S) => [React.FunctionComponent<{}>, () => [S, Actions<S, T>]];
