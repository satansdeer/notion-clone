export function debounce(callback: Function, delay = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, args), delay);
  };
}
