/* eslint-disable sort-keys */
import { debounce } from './debounce';

describe('debounce', () => {
  let mockFn = jest.fn();
  const wait = 100;
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockFn.mockClear();
  });

  it('returns the result of a single operation', async () => {
    mockFn = jest.fn().mockResolvedValue('foo');
    const debouncedFn = debounce(mockFn, wait);
    const promise = debouncedFn('foo');

    jest.runAllTimers();

    const result = await promise;

    expect(result).toBe('foo');
  });

  it('returns the result of a single operation with a wait function', async () => {
    mockFn = jest.fn().mockResolvedValue('foo');
    const debouncedFn = debounce(mockFn, 100);
    const promise = debouncedFn('foo');
    jest.runAllTimers();
    const result = await promise;

    expect(result).toBe('foo');
  });

  it('debounce function is called only once within the wait period', () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn('test');
    debouncedFn('test');
    debouncedFn('test');

    jest.advanceTimersByTime(wait);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('accumulate multiple calls into a single one', async () => {
    const debouncedFn = debounce(mockFn, wait, { accumulate: true });
    debouncedFn('first');
    debouncedFn('second');
    jest.advanceTimersByTime(wait);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(['first'], ['second']);
  });

  it('function is called again after wait time expires for subsequent calls', async () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn('first');
    jest.advanceTimersByTime(wait);
    debouncedFn('second');
    jest.advanceTimersByTime(wait);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('second');
  });

  it('captures first call immediately and accumulates subsequent calls', async () => {
    mockFn = jest.fn((args) => args);
    const debouncedFn = debounce(mockFn, wait, { accumulate: true });
    const firstCallPromise = debouncedFn('first');
    const secondCallPromise = debouncedFn('second');
    const thirdCallPromise = debouncedFn('third');

    jest.advanceTimersByTime(120);

    const firstResult = await firstCallPromise;
    const secondResult = await secondCallPromise;
    await thirdCallPromise;

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(firstResult).toEqual('first');
    expect(secondResult).toBeUndefined();
    expect(mockFn.mock.calls[0][0]).toEqual(['first']);
  });

  it('calls the function after the specified wait time', () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(wait);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('does not call the function before the wait time expires', () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn();
    jest.advanceTimersByTime(99);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('calls the function only once within the wait time', () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(wait);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('resets the debounce timer on subsequent calls', () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn();
    jest.advanceTimersByTime(50);
    debouncedFn();
    jest.advanceTimersByTime(50);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(50);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
  it('accumulates calls when accumulate option is true', () => {
    mockFn = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve('result'), 50)));
    const debouncedFn = debounce(mockFn, wait, { accumulate: true });

    debouncedFn('first');
    debouncedFn('second');

    jest.advanceTimersByTime(wait);
    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith(['first'], ['second']);
    }, 150);

    jest.advanceTimersByTime(150);
  });

  it('debounce with rapid successive calls', () => {
    const debouncedFn = debounce(mockFn, wait);

    for (let i = 0; i < 10; i++) {
      debouncedFn();
    }

    jest.advanceTimersByTime(1000);

    setTimeout(() => {
      expect(mockFn).toHaveBeenCalledTimes(1);
    }, 50);
    jest.advanceTimersByTime(50);
  });

  it('function call after debounce period ends', () => {
    const debouncedFn = debounce(mockFn, wait);

    debouncedFn();
    jest.advanceTimersByTime(wait);

    setTimeout(() => {
      debouncedFn();
      jest.advanceTimersByTime(wait);

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(2);
      }, 10);

      jest.advanceTimersByTime(10);
    }, 10);

    jest.advanceTimersByTime(10);
  });

  it('executes the debounced function only once for three rapid calls', () => {
    const mockCallback = jest.fn();

    const debouncedFn = debounce(mockCallback, wait);
    debouncedFn('call1');
    debouncedFn('call2');
    debouncedFn('call3');

    expect(mockCallback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(wait);

    expect(mockCallback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(300);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('call3');
  });

  it('properly initializes and uses deferred', () => {
    const mockCallback = jest.fn();
    const debouncedFn = debounce(mockCallback, wait);

    debouncedFn();

    expect(mockCallback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(wait);
  });

  it('should not execute the function if deferred is not set', () => {
    const mockFn = jest.fn();
    debounce(mockFn, 0);

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('function is not called immediately', () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('function is called after the wait time for a single call', () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn();
    jest.advanceTimersByTime(wait);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('rapid successive calls lead to a single function call', () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn();
    debouncedFn();
    debouncedFn();
    jest.advanceTimersByTime(wait);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('function is called after the wait time for spaced-out calls', () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn();
    jest.advanceTimersByTime(wait);
    debouncedFn();
    jest.advanceTimersByTime(wait);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('function is called right when the wait time is met (boundary condition)', () => {
    const debouncedFn = debounce(mockFn, wait);
    debouncedFn();
    jest.advanceTimersByTime(wait);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('debounced function is called once when called right at the boundary of the currentWait period', () => {
    const debouncedFn = debounce(mockFn, wait);

    debouncedFn();
    jest.advanceTimersByTime(99);
    expect(mockFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    debouncedFn();
    jest.advanceTimersByTime(99);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
