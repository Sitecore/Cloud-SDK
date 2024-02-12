describe('debug module', () => {
  beforeEach(() => {
    process.env.DEBUG_MULTILINE = 'true';
    jest.resetModules();
  });

  it('should set multiline formatter when env variable DEBUG_MULTILINE is true', async () => {
    const module = await import('./debug');
    expect(module.debug.formatters.o.toString()).toEqual(module.debug.formatters.O.toString());
  });

  it('should not set multiline formatter when env variable DEBUG_MULTILINE is false', async () => {
    process.env.DEBUG_MULTILINE = 'false';

    const module = await import('./debug');
    expect(module.debug.formatters.o.toString()).not.toEqual(module.debug.formatters.O.toString());
  });
});
