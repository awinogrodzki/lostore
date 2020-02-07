/// <reference types="react" />
export declare type ActionReducer<S> = (state: S) => S;
export declare type ActionReducerCreator<S, T extends (...args: any[]) => ActionReducer<S> | Promise<ActionReducer<S>>> = (...args: Parameters<T>) => ReturnType<T>;
export declare type ActionReducers<S, T extends {
    [type: string]: ActionReducerCreator<S, any>;
}> = {
    [K in keyof T]: T[K];
};
declare type PromiseOrVoid<T extends (...args: any) => any> = T extends Promise<any> ? Promise<void> : void;
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
export {};
