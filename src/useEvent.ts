import { useCallback, useLayoutEffect, useRef } from "react";

export function useEvent(handler: any) {
  const handlerRef = useRef<any>(null);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args) => {
    const fn = handlerRef.current;
    return fn(...args);
  }, []);
}
