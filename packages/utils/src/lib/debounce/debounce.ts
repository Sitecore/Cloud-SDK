// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
/* eslint-disable @typescript-eslint/no-empty-function, tsdoc/syntax, sort-keys, @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

/**
 * Creates a debounced function that delays invoking `fn` until after `wait` milliseconds have elapsed
 * since the last time the debounced function was invoked. Optionally accumulates arguments of invocations
 * over the wait period.
 *
 * @template T The types of the arguments to the function to debounce.
 * @param fn The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @param opts The options object.
 * @param options.accumulate Whether to accumulate arguments of each call during the wait time.
 * @returns A new debounced function.
 */
export function debounce<T extends any[]>(
  fn: (...args: T) => Promise<any> | void,
  wait: number,
  opts: DebounceOptions = {}
): (...args: T) => Promise<unknown> | void {
  let deferred: Deferred<any> | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const pendingArgs: any[] = [];

  const debounced = (...args: T): Promise<any> | void => {
    if (deferred && timer) clearTimeout(timer);
    else deferred = defer<any>();

    pendingArgs.push(args);
    timer = setTimeout(() => {
      flush();
    }, wait);

    if (opts.accumulate) {
      const argsIndex = pendingArgs.length - 1;
      return deferred.promise.then((results) => results[argsIndex]);
    }

    return deferred.promise;
  };

  const flush = (): void => {
    const thisDeferred = deferred;
    clearTimeout(timer);

    Promise.resolve(
      opts.accumulate ? fn(...(pendingArgs as unknown as T)) : fn(...pendingArgs[pendingArgs.length - 1])
    ).then(thisDeferred!.resolve, thisDeferred!.reject);

    pendingArgs.length = 0;
    deferred = undefined;
  };

  return debounced;
}

/**
 * Creates a deferred object with `promise`, `resolve`, and `reject` properties.
 *
 * @template T The promised value's type.
 * @returns The deferred object.
 */
function defer<T>(): Deferred<T> {
  let resolve: (value: T) => void = () => {};
  let reject: (reason: any) => void = () => {};
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/**
 * Options for the debounce function.
 * @property {boolean} - Whether to accumulate arguments of each call during the wait time.
 */
type DebounceOptions = {
  accumulate?: boolean;
};

/**
 * Represents a deferred operation.
 *
 * @interface Deferred
 * @template T
 * @property {Promise<T>} promise - The promise associated with the deferred operation.
 * @property {(value: T) => void} resolve - Resolves the promise with a value.
 * @property {(reason: any) => void} reject - Rejects the promise with a reason.
 */
interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: any) => void;
}
