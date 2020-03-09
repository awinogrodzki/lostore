export type Listener<S> = (state: S) => any;
export type Unsubscribe = () => any;

export class Store<S> {
  private state: S;
  private subscribers = new Set<Listener<S>>();

  constructor(initialState: S) {
    this.state = initialState;
  }

  public setState(state: S) {
    this.state = state;
    this.publish();
  }

  public getState() {
    return this.state;
  }

  public subscribe(listener: Listener<S>): Unsubscribe {
    this.subscribers.add(listener);

    return () => this.subscribers.delete(listener);
  }

  private publish() {
    this.subscribers.forEach(subscriber => {
      subscriber(this.state);
    });
  }
}

export const createStore = <S>(initialState: S) => {
  return new Store(initialState);
};
