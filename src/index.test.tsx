import * as React from 'react';
import { createStoreHook } from '.';
import { renderHook, act } from '@testing-library/react-hooks';

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

  it('should update state by calling action', async () => {
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

    act(() => {
      const { increment } = result.current[1];

      increment();
    });

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

    await act(async () => {
      const { increment } = result.current[1];

      await increment();
    });

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

    await act(async () => {
      const { increment } = result.current[1];

      await increment();
    });

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

    await act(async () => {
      const { increment } = result.current[1];

      await increment();
    });

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

      expect(increment()).rejects.toEqual(new Error('useStore hook used outside StoreProvider. Please make sure you have wrapped components that use useStore hook with StoreProvider.'));
    });
  });
});
