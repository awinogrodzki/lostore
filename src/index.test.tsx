import * as React from 'react';
import { createStoreHook } from '.';
import { renderHook, act } from '@testing-library/react-hooks';
import { dispatchAndUpdate, dispatchAsyncAndUpdate } from './test/utils';

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

  it('should not overwrite state between updates', () => {
    const initialState: string[] = [];

    const [StoreProvider, useStore] = createStoreHook(
      {
        addString: (value: string) => (state: string[]) => [...state, value],
      },
      initialState
    );
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });

    dispatchAndUpdate(() => {
      result.current[1].addString('first string');
      result.current[1].addString('second string');
      result.current[1].addString('third string');
    });

    expect(result.current[0]).toEqual(['first string', 'second string', 'third string']);
  });

  it('should combine multiple action reducers', () => {
    type State = {
      count: number;
      strings: string[];
      element: {
        position: {
          x: number;
          y: number;
        };
      };
    };
    const initialState: State = {
      count: 0,
      strings: [],
      element: {
        position: {
          x: 0,
          y: 0,
        },
      },
    };

    const [StoreProvider, useStore] = createStoreHook(
      {
        count: {
          countStrings: () => (state: number, gridState: State) => {
            return gridState.strings.length;
          },
        },
        strings: {
          addString: (value: string) => (state: string[], gridState: State) => {
            return [...state, `${value}-${gridState.count}`];
          },
        },
        element: {
          position: {
            updatePosition: (x: number, y: number) => (
              pos: { x: number; y: number },
              rootState: State
            ) => ({
              x: rootState.count + pos.x + x,
              y: rootState.count + pos.y + y,
            }),
          },
        },
      },
      initialState
    );
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });

    dispatchAndUpdate(() => {
      result.current[1].strings.addString('string');
      result.current[1].count.countStrings();
      result.current[1].strings.addString('string');
      result.current[1].count.countStrings();
      result.current[1].strings.addString('string');
      result.current[1].count.countStrings();
      result.current[1].element.position.updatePosition(1, 2);
      result.current[1].strings.addString('string');
      result.current[1].count.countStrings();
      result.current[1].element.position.updatePosition(4, 8);
    });

    expect(result.current[0]).toEqual({
      count: 4,
      strings: ['string-0', 'string-1', 'string-2', 'string-3'],
      element: {
        position: {
          x: 12,
          y: 17,
        },
      },
    });
  });
});
