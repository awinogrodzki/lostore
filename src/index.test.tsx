import * as React from 'react';
import { createStoreHook } from '.';
import { renderHook, act } from '@testing-library/react-hooks';
import { StoreContextValue, StoreProviderProps } from './types';

const dispatchAsyncAndUpdate = async (callback: () => Promise<void | undefined>) => {
  await act(callback);
}

const dispatchAndUpdate = (callback: () => void | undefined) => {
  act(callback);
}

describe('index', () => {
  it('should return initial state', () => {
    const initialState = 'Hello world!';
    const [StoreProvider, useStore] = createStoreHook({}, initialState);
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });

    expect(result.current[0]).toBe('Hello world!');
  });

  it('should update state by calling action', () => {
    const initialState = 0;
    const [StoreProvider, useStore] = createStoreHook(
      {
        increment: () => (state: number) => state + 1,
      },
      initialState
    );
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });
    const { increment } = result.current[1];
    
    dispatchAndUpdate(() => increment());

    expect(result.current[0]).toBe(1);
  });

  it('should update state with async reducer', async () => {
    const initialState = 0;
    const [StoreProvider, useStore] = createStoreHook(
      {
        increment: () => async (state: number) => state + 1,
      },
      initialState
    );
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });
    const { increment } = result.current[1];
    
    await dispatchAsyncAndUpdate(() => increment());

    expect(result.current[0]).toBe(1);
  });

  it('should update state with async action', async () => {
    const initialState = 0;
    const [StoreProvider, useStore] = createStoreHook(
      {
        increment: async () => (state: number) => state + 1,
      },
      initialState
    );
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });
    const { increment } = result.current[1];
    
    await dispatchAsyncAndUpdate(() => increment());

    expect(result.current[0]).toBe(1);
  });

  it('should update state with async action and async reducer', async () => {
    const initialState = 0;
    const [StoreProvider, useStore] = createStoreHook(
      {
        increment: async () => async (state: number) => state + 1,
      },
      initialState
    );
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });
    const { increment } = result.current[1];
    
    await dispatchAsyncAndUpdate(() => increment());

    expect(result.current[0]).toBe(1);
  });

  it('should throw error if used outside store provider', async () => {
    const initialState = 0;
    const [, useStore] = createStoreHook(
      {
        increment: async () => async (state: number) => state + 1,
      },
      initialState
    );

    const { result } = renderHook(() => useStore());

    await act(async () => {
      const { increment } = result.current[1];

      expect(increment()).rejects.toEqual(
        new Error(
          'useStore hook used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.'
        )
      );
    });
  });

  it('should set initial value to given initial state', async () => {
    const initialState = 'Initial state';
    const [StoreProvider, useStore] = createStoreHook({}, initialState);
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });

    expect(result.current[0]).toBe('Initial state');
  });

  it('should prefer initial state given as store provider prop over the one given during hook creation', async () => {
    const initialState = 'Initial state';
    const [StoreProvider, useStore] = createStoreHook({}, initialState);
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider initialState="Initial state from props">{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });

    expect(result.current[0]).toBe('Initial state from props');
  });

  it('should not update context value if the value has not changed', () => {
    const mockSetState = jest.fn();
    const initialState = 0;
    const StoreContextMock = React.createContext<StoreContextValue<number>>({
      state: initialState,
      setState: () => {},
    });
    const StoreProviderMock: React.FunctionComponent<StoreProviderProps<number>> = ({
      children,
    }) => {
      const [state, setState] = React.useState(initialState);

      return (
        <StoreContextMock.Provider
          value={{
            state,
            setState: value => {
              setState(value);
              mockSetState(value);
            },
          }}
        >
          {children}
        </StoreContextMock.Provider>
      );
    };

    const [, useStore] = createStoreHook(
      {
        updateState: (value: number) => () => value,
      },
      initialState,
      StoreContextMock,
      StoreProviderMock
    );
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProviderMock>{children}</StoreProviderMock>
    );
    const { result } = renderHook(() => useStore(), { wrapper });
    
    dispatchAndUpdate(() => result.current[1].updateState(1));
    dispatchAndUpdate(() => result.current[1].updateState(2));
    dispatchAndUpdate(() => result.current[1].updateState(1));
    dispatchAndUpdate(() => result.current[1].updateState(1));

    expect(mockSetState).toHaveBeenCalledTimes(3);
  });
});
