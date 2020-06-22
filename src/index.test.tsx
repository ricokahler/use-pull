import React, { useState, useEffect } from 'react';
import { create, act } from 'react-test-renderer';
import usePull from './index';

const delay = () => new Promise((resolve) => setTimeout(resolve, 10));

function createDeferredPromise() {
  let resolve!: () => void;
  let reject!: () => void;

  const promise = new Promise((thisResolve, thisReject) => {
    resolve = thisResolve;
    reject = thisReject;
  });

  return Object.assign(promise, { resolve, reject });
}

it('wraps values in refs and allows pull based extraction (purposefully removing reactivity)', async () => {
  const wrappedCountHandler = jest.fn();
  const normalCountHandler = jest.fn();
  const done = createDeferredPromise();

  function ExampleComponent() {
    const [count, setCount] = useState(0);
    const getCount = usePull(count);

    useEffect(() => {
      const count = getCount();
      wrappedCountHandler(count);
    }, [getCount]);

    useEffect(() => {
      (async () => {
        setCount((count) => count + 1);
        await delay();
        setCount((count) => count + 1);
        await delay();
        setCount((count) => count + 1);
        await delay();
        done.resolve();
      })();
    }, []);

    useEffect(() => {
      normalCountHandler(count);
    }, [count]);

    return null;
  }

  await act(async () => {
    create(<ExampleComponent />);
    await done;
  });

  expect(wrappedCountHandler).toHaveBeenCalledTimes(1);
  expect(normalCountHandler).toHaveBeenCalledTimes(4);
});
