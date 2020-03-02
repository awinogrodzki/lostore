/// <reference types="react" />
export declare type ActionReducer<S, RS> = (state: S, rootState: RS) => S;
export declare type ActionReducerCreator<S = any, RS = S, T extends (...args: any[]) => ActionReducer<S, RS> | AsyncActionReducer<S, RS> = any> = (...args: Parameters<T>) => ReturnType<T>;
export declare type ActionReducers<S extends any = any, T extends ActionReducers<S> = any, RS = S> = {
    [K in keyof T]: T[K] extends ActionReducers<S[K]> ? ActionReducers<S[K], T[K], S> : T[K] extends ActionReducerCreator<S[K]> ? ActionReducerCreator<S[K], S, T[K]> : never;
};
export declare type PromiseOrVoid<T extends (...args: any) => any> = T extends Promise<any> ? Promise<void> : void;
export declare type Actions<S extends any, T extends any, RS = S> = {
    [K in keyof T]: T[K] extends ActionReducerCreator<S[K], RS> ? (...args: Parameters<T[K]>) => PromiseOrVoid<ReturnType<T[K]>> : T[K] extends Actions<S[K], T[K]> ? Actions<S[K], T[K], RS> : never;
};
export interface StoreProviderProps<S> {
    initialState?: S;
}
export declare type SetStateCallback<S, RS> = (prevState: S, rootState: RS) => S;
export declare type SetState<S, RS> = (callback: SetStateCallback<S, RS>) => void;
export interface StoreContextValue<S> {
    state: S;
    setState: React.Dispatch<React.SetStateAction<S>>;
}
export declare type StoreContext<S> = React.Context<StoreContextValue<S>>;
export declare type AsyncActionReducer<S, RS> = Promise<ActionReducer<S, RS>>;
export declare type ActionCreator<T extends (...args: any) => any> = (...args: Parameters<T>) => PromiseOrVoid<T>;
