import * as React from 'react';
import { createHookStore } from '.';
import { act as domAct } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { dispatchAndUpdate, dispatchAsyncAndUpdate } from './test/utils';
import { mount } from 'enzyme';

describe('index', () => {
  it('should return initial state', () => {
    const initialState = 'Hello world!';
    const { StoreProvider, useStore, createStore } = createHookStore({}, initialState);
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider store={createStore()}>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });

    expect(result.current[0]).toBe('Hello world!');
  });

  it('should update state by calling action', () => {
    const initialState = 0;
    const { StoreProvider, useStore, createStore } = createHookStore(
      {
        increment: () => (state: number) => state + 1,
      },
      initialState
    );
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider store={createStore()}>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });
    const { increment } = result.current[1];

    dispatchAndUpdate(() => increment());

    expect(result.current[0]).toBe(1);
  });

  it('should update state with async action', async () => {
    const initialState = 0;
    const { StoreProvider, useStore, createStore } = createHookStore(
      {
        increment: async () => (state: number) => state + 1,
      },
      initialState
    );
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider store={createStore()}>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });
    const { increment } = result.current[1];

    await dispatchAsyncAndUpdate(() => increment());

    expect(result.current[0]).toBe(1);
  });

  it('should set initial value to given initial state', async () => {
    const initialState = 'Initial state';
    const { StoreProvider, useStore, createStore } = createHookStore({}, initialState);
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider store={createStore()}>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });

    expect(result.current[0]).toBe('Initial state');
  });

  it('should prefer prerendered state over initial state', async () => {
    const initialState = 'Initial state';
    const { StoreProvider, useStore, createStore } = createHookStore({}, initialState);
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider store={createStore('Initial state from props')}>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });

    expect(result.current[0]).toBe('Initial state from props');
  });

  it('should not overwrite state between updates', () => {
    const initialState: string[] = [];

    const { StoreProvider, useStore, createStore } = createHookStore(
      {
        addString: (value: string) => (state: string[]) => [...state, value],
      },
      initialState
    );
    const wrapper: React.FunctionComponent = ({ children }) => (
      <StoreProvider store={createStore()}>{children}</StoreProvider>
    );
    const { result } = renderHook(() => useStore(), { wrapper });

    dispatchAndUpdate(() => {
      result.current[1].addString('first string');
      result.current[1].addString('second string');
      result.current[1].addString('third string');
    });

    expect(result.current[0]).toEqual(['first string', 'second string', 'third string']);
  });

  it('should connect component to a store using connect higher order component in order to optimize renders', () => {
    type DummyElement = { id: string; value: string };
    type State = DummyElement[];
    const initialState: State = [];
    const reducers = {
      addElement: (element: DummyElement) => (state: string[]) => {
        return [...state, element];
      },
    };

    const { StoreProvider, connectStore, createStore } = createHookStore(reducers, initialState);

    interface DummyComponentProps {
      ownExternalProp: string;
      externalProp: string;
      mostRecentElement?: DummyElement;
      addElement: (element: DummyElement) => void;
    }

    const DummyComponent: React.FunctionComponent<DummyComponentProps> = ({
      mostRecentElement,
      ownExternalProp,
    }) => {
      if (!mostRecentElement) {
        return null;
      }

      return (
        <div>
          {mostRecentElement.id} {ownExternalProp} {mostRecentElement.value}
        </div>
      );
    };

    const mapStateToProps = (state: State, ownProps: { externalProp: string }) => ({
      ownExternalProp: `own-${ownProps.externalProp}`,
      mostRecentElement: state.length ? state[state.length - 1] : undefined,
    });

    const ConnectedDummyComponent = connectStore(mapStateToProps, (actions, ownProps) => ({
      addElement: actions.addElement,
    }))(DummyComponent);

    const wrapper = mount(
      <StoreProvider store={createStore()}>
        <ConnectedDummyComponent externalProp="externalPROP" />
      </StoreProvider>
    );

    domAct(() =>
      (wrapper.find('Memo(DummyComponent)').prop('addElement') as (element: DummyElement) => void)({
        id: 'new-element',
        value: 'New element',
      })
    );

    wrapper.update();
    expect(wrapper.text()).toBe('new-element own-externalPROP New element');
  });
});
