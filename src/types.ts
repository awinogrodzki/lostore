import { Store } from './store';

export type ActionReducer<S> = (state: S) => S;

export type ActionReducerCreator<
  S = any,
  T extends (...args: any[]) => ActionReducer<S> | AsyncActionReducer<S> = any
> = (...args: Parameters<T>) => ReturnType<T>;

export type ActionReducers<S extends any = any, T extends ActionReducers<S> = any> = {
  [K in keyof T]: ActionReducerCreator<S[K], T[K]>;
};

export type PromiseOrVoid<T extends (...args: any) => any> = T extends Promise<any>
  ? Promise<void>
  : void;

export type Actions<S extends any, T extends any> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => PromiseOrVoid<ReturnType<T[K]>>;
};

export type OnUpdate<S> = (state: S) => void | Promise<void>;

export interface StoreProviderProps<S> {
  store: Store<S>;
}

export interface StoreContextValue<S> {
  state: S;
  store: Store<S>;
}

export type StoreContext<S> = React.Context<StoreContextValue<S>>;

export type AsyncActionReducer<S> = Promise<ActionReducer<S>>;

export type ActionCreator<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => PromiseOrVoid<T>;
