# usePull · [![Build Status](https://travis-ci.org/ricokahler/use-pull.svg?branch=master)](https://travis-ci.org/ricokahler/use-pull) [![Coverage Status](https://coveralls.io/repos/github/ricokahler/use-pull/badge.svg?branch=master)](https://coveralls.io/github/ricokahler/use-pull?branch=master)

> `usePull` is a hook that will wrap a value with a ref and return a memoized callback that pulls the latest version of that value.

## Installation

```
npm install --save use-pull
```

## Usage

```js
function ExampleComponent({ id }) {
  const value = /* ... */;

  // wrap your value with `usePull`
  const getValue = usePull(value);
  // `usePull` will then return a memoized callback
  // that won't change references between renders

  // there are many reasons you'd want to do this:
  // - one reason is to preserve the reference of a callback by
  //   pulling the latest value at the time the callback is ran
  const handleSomething = useCallback(() => {
    const value = getValue();
  }, [getValue]);

  // - another reason may be to pull a value in an effect
  //   but not react to changes in that value
  useEffect(() => {
    const value = getValue();

    // do something with `value` and `id`...
  }, [id, getValue]);

  // ...
}
```
