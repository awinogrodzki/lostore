import { isStateEqual } from './provider';

describe('provider', () => {
  it('should render if state is different', () => {
    expect(isStateEqual('initial state', 'new state')).toBe(false);
  });

  it('should not render if the state has not changed', () => {
    expect(isStateEqual('initial state', 'initial state')).toBe(true);
  });

  it('should not render if the state properties has not changed', () => {
    expect(isStateEqual({ name: 'john' }, { name: 'john' })).toBe(true);
  });

  it('should  render if the previous state properties has not changed but new property has been added', () => {
    expect(isStateEqual({ name: 'john' }, { name: 'john', email: 'john@doe.com' })).toBe(false);
  });

  it('should  render if the previous state property has been removed', () => {
    expect(isStateEqual({ name: 'john', email: 'john@doe.com' }, { name: 'john' })).toBe(false);
  });

  it('should not render if the new array has the same values as before', () => {
    expect(isStateEqual(['one', 'two'], ['one', 'two'])).toBe(true);
  });

  it('should render if the new value has been added to the state', () => {
    expect(isStateEqual(['one', 'two'], ['one', 'two', 'three'])).toBe(false);
  });

  it('should render if a value has been removed from the state', () => {
    expect(isStateEqual(['one', 'two', 'three'], ['one', 'two'])).toBe(false);
  });
});
