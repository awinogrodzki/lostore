/// <reference types="react" />
export declare type ActionReducer<S> = (state: S) => ReducerResult<S>;
export declare type ActionReducerCreator<S, T extends (...args: any[]) => ActionReducer<S> | Promise<ActionReducer<S>>> = (...args: Parameters<T>) => ReturnType<T>;
export declare type ActionReducers<S, T extends {
    [type: string]: ActionReducerCreator<S, any>;
}> = {
    [K in keyof T]: T[K];
};
declare type ReturnTypeOrVoid<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : void;
declare type PromiseOrVoid<T extends (...args: any) => any> = T extends Promise<any> ? Promise<void> : ReturnTypeOrVoid<T> extends Promise<any> ? Promise<void> : void;
export declare type Actions<S, T extends ActionReducers<S, any>> = {
    [K in keyof T]: (...args: Parameters<T[K]>) => PromiseOrVoid<ReturnType<T[K]>>;
};
export interface StoreProviderProps<S> {
    initialState?: S;
}
export interface StoreContextValue<S> {
    state: S;
    setState: React.Dispatch<React.SetStateAction<S>>;
}
export declare type StoreContext<S> = React.Context<StoreContextValue<S>>;
export declare type AsyncActionReducer<S> = Promise<ActionReducer<S>>;
export declare type ReducerResult<S> = S | Promise<S>;
export {};
