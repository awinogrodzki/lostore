/// <reference types="react" />
import { Store } from './store';
export declare type ActionReducer<S> = (state: S) => S;
export declare type ActionReducerCreator<S = any, T extends (...args: any[]) => ActionReducer<S> | AsyncActionReducer<S> = any> = (...args: Parameters<T>) => ReturnType<T>;
export declare type ActionReducers<S extends any = any, T extends ActionReducers<S> = any> = {
    [K in keyof T]: ActionReducerCreator<S[K], T[K]>;
};
export declare type PromiseOrVoid<T extends (...args: any) => any> = T extends Promise<any> ? Promise<void> : void;
export declare type Actions<S extends any, T extends any> = {
    [K in keyof T]: (...args: Parameters<T[K]>) => PromiseOrVoid<ReturnType<T[K]>>;
};
export declare type OnUpdate<S> = (state: S) => void | Promise<void>;
export interface StoreProviderProps<S> {
    store: Store<S>;
}
export interface StoreContextValue<S> {
    state: S;
    store: Store<S>;
}
export declare type StoreContext<S> = React.Context<StoreContextValue<S>>;
export declare type AsyncActionReducer<S> = Promise<ActionReducer<S>>;
export declare type ActionCreator<T extends (...args: any) => any> = (...args: Parameters<T>) => PromiseOrVoid<T>;
