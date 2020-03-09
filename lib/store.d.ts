export declare type Listener<S> = (state: S) => any;
export declare type Unsubscribe = () => any;
export declare class Store<S> {
    private state;
    private subscribers;
    constructor(initialState: S);
    setState(state: S): void;
    getState(): S;
    subscribe(listener: Listener<S>): Unsubscribe;
    private publish;
}
export declare const createStore: <S>(initialState: S) => Store<S>;
