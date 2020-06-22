(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global = global || self, global.usePull = factory(global.React));
}(this, (function (react) { 'use strict';

  // React currently throws a warning when using useLayoutEffect on the server.
  // To get around it, we can conditionally useEffect on the server (no-op) and
  // useLayoutEffect in the browser. We need useLayoutEffect to ensure the store
  // subscription callback always has the selector from the latest render commit
  // available, otherwise a store update may happen between render and the effect,
  // which may cause missed updates; we also must ensure the store subscription
  // is created synchronously, otherwise a store update may occur before the
  // subscription is created and an inconsistent state may be observed

  var useUniversalLayoutEffect = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined' ? react.useLayoutEffect : react.useEffect;

  function usePull(value) {
    var ref = react.useRef(value);
    useUniversalLayoutEffect(function () {
      ref.current = value;
    }, [value]);
    var pull = react.useCallback(function () {
      return ref.current;
    }, []);
    return pull;
  }

  return usePull;

})));
//# sourceMappingURL=index.js.map
