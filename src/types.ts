export type ActionReducer<S, RS> = (state: S, rootState: RS) => S;

export type ActionReducerCreator<
  S = any,
  RS = S,
  T extends (...args: any[]) => ActionReducer<S, RS> | AsyncActionReducer<S, RS> = any
> = (...args: Parameters<T>) => ReturnType<T>;

export type ActionReducers<S extends any = any, T extends ActionReducers<S> = any, RS = S> = {
  [K in keyof T]: T[K] extends ActionReducers<S[K]>
    ? ActionReducers<S[K], T[K], S>
    : T[K] extends ActionReducerCreator<S[K]>
    ? ActionReducerCreator<S[K], S, T[K]>
    : never;
};

export type PromiseOrVoid<T extends (...args: any) => any> = T extends Promise<any>
  ? Promise<void>
  : void;

export type Actions<S extends any, T extends any, RS = S> = {
  [K in keyof T]: T[K] extends ActionReducerCreator<S[K], RS>
    ? (...args: Parameters<T[K]>) => PromiseOrVoid<ReturnType<T[K]>>
    : T[K] extends Actions<S[K], T[K]>
    ? Actions<S[K], T[K], RS>
    : never;
};

export interface StoreProviderProps<S> {
  initialState?: S;
}

export type SetState<S, RS> = (callback: (prevState: S, rootState: RS) => S) => void;

export interface StoreContextValue<S> {
  state: S;
  setState: React.Dispatch<React.SetStateAction<S>>;
}

export type StoreContext<S> = React.Context<StoreContextValue<S>>;

export type AsyncActionReducer<S, RS> = Promise<ActionReducer<S, RS>>;

export type ActionCreator<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => PromiseOrVoid<T>;
