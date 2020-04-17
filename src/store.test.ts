import { Store } from './store';

describe('store', () => {
  it('should call listener on state update', () => {
    const listener = jest.fn();
    const store = new Store({ name: 'John' });
    store.subscribe(listener);
    
    store.setState({ name: 'Johnny' });

    expect(listener).toHaveBeenCalledWith({ name: 'Johnny' });
  });

  it('should not call listener on state update, if the state has not changed', () => {
    const listener = jest.fn();
    const store = new Store({ name: 'John' });
    store.subscribe(listener);
    
    store.setState({ name: 'John' });

    expect(listener).not.toHaveBeenCalled();
  });
})