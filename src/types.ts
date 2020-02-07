export type ActionReducer<S> = (state: S) => ReducerResult<S>;
export type ActionReducerCreator<
  S,
  T extends (...args: any[]) => ActionReducer<S> | Promise<ActionReducer<S>>
> = (...args: Parameters<T>) => ReturnType<T>;
export type ActionReducers<S, T extends { [type: string]: ActionReducerCreator<S, any> }> = {
  [K in keyof T]: T[K];
};

type ReturnTypeOrVoid<T extends (...args: any) => any> = T extends (...args: any) => infer R
  ? R
  : void;
type PromiseOrVoid<T extends (...args: any) => any> = T extends Promise<any>
  ? Promise<void>
  : ReturnTypeOrVoid<T> extends Promise<any>
  ? Promise<void>
  : void;
export type Actions<S, T extends ActionReducers<S, any>> = {
  [K in keyof T]: (...args: Parameters<T[K]>) => PromiseOrVoid<ReturnType<T[K]>>;
};

export interface StoreProviderProps<S> {
  initialState?: S;
}

export interface StoreContextValue<S> {
  state: S;
  setState: React.Dispatch<React.SetStateAction<S>>;
}

export type StoreContext<S> = React.Context<StoreContextValue<S>>;

export type AsyncActionReducer<S> = Promise<ActionReducer<S>>;

export type ReducerResult<S> = S | Promise<S>;
