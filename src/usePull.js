import { useRef, useLayoutEffect, useCallback } from 'react';

function usePull(value) {
  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  const pull = useCallback(() => {
    return ref.current;
  }, []);

  return pull;
}

export default usePull;
