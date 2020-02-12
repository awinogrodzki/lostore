import { act } from '@testing-library/react-hooks';

export const dispatchAsyncAndUpdate = async (callback: () => Promise<void | undefined>) => {
  await act(callback);
}

export const dispatchAndUpdate = (callback: () => void | undefined) => {
  act(callback);
}