import React, { useState, useEffect } from 'react';
import { create, act } from 'react-test-renderer';
import usePull from './usePull';
import delay from 'delay';

class DeferredPromise {
  constructor() {
    this.state = 'pending';
    this._promise = new Promise((resolve, reject) => {
      this.resolve = value => {
        this.state = 'fulfilled';
        resolve(value);
      };
      this.reject = reason => {
        this.state = 'rejected';
        reject(reason);
      };
    });

    this.then = this._promise.then.bind(this._promise);
    this.catch = this._promise.catch.bind(this._promise);
    this.finally = this._promise.finally.bind(this._promise);
  }

  [Symbol.toStringTag] = 'Promise';
}

it('wraps values in refs and allows pull based extraction (purposefully removing reactivity)', async () => {
  const wrappedCountHandler = jest.fn();
  const normalCountHandler = jest.fn();
  const done = new DeferredPromise();

  function ExampleComponent() {
    const [count, setCount] = useState(0);
    const getCount = usePull(count);

    useEffect(() => {
      const count = getCount();
      wrappedCountHandler(count);
    }, [getCount]);

    useEffect(() => {
      (async () => {
        setCount(count => count + 1);
        await delay(10);
        setCount(count => count + 1);
        await delay(10);
        setCount(count => count + 1);
        await delay(10);
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
