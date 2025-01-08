describe('debug module', () => {
  const originalProcess = global.process;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    global.process = originalProcess;
  });

  it('should set multiline formatter when env variable DEBUG_MULTILINE is true', async () => {
    global.process.env.DEBUG_MULTILINE = 'true';

    const module = await import('./debug');
    expect(module.debug.formatters.o.toString()).toEqual(module.debug.formatters.O.toString());
  });

  it('should not set multiline formatter when env variable DEBUG_MULTILINE is false', async () => {
    global.process.env.DEBUG_MULTILINE = 'false';

    const module = await import('./debug');
    expect(module.debug.formatters.o.toString()).not.toEqual(module.debug.formatters.O.toString());
  });

  it('should not set multiline formatter when process.env is undefined', async () => {
    (global as any).process = undefined;

    const module = await import('./debug');
    expect(module.debug.formatters?.o).toBe(undefined);
  });
});
