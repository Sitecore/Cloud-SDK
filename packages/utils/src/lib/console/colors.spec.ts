import * as colors from './colors';

describe('colors', () => {
  describe('supported browser', () => {
    const chromeUserAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

    beforeEach(() => {
      jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(chromeUserAgent);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    const colorVariants = [
      { fn: colors.red, reg: new RegExp(`\\u001B\\[31mtest\\u001B\\[0m`) },
      { fn: colors.blue, reg: new RegExp(`\\u001B\\[34mtest\\u001B\\[0m`) },
      { fn: colors.cyan, reg: new RegExp(`\\u001B\\[36mtest\\u001B\\[0m`) },
      { fn: colors.green, reg: new RegExp(`\\u001B\\[32mtest\\u001B\\[0m`) },
      { fn: colors.yellow, reg: new RegExp(`\\u001B\\[33mtest\\u001B\\[0m`) }
    ];

    it.each(colorVariants)('should return the string containing the ANSI code and reset at the end', (variant) => {
      const result = variant.fn('test');

      expect(result).toMatch(variant.reg);
    });

    it('should be able to be used in template literals and combined with other colors', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const expectedResultRegExp = new RegExp(`\\u001B\\[31mred\\u001B\\[0m\\u001B\\[34mblue\\u001B\\[0mreset`);

      console.log(`${colors.red('red')}${colors.blue('blue')}reset`);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(expectedResultRegExp));
    });
  });

  describe('unsupported browser', () => {
    it('should return the original string if in browser environment but not supporting coloring', () => {
      const firefoxUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0';
      jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(firefoxUserAgent);

      const result = colors.red('test');
      const expectedResultRegExp = new RegExp(`\\u001B\\[31mtest\\u001B\\[0m`);

      expect(result).not.toMatch(expectedResultRegExp);
    });
  });

  describe('node environment', () => {
    let windowSpy: jest.SpyInstance;

    beforeEach(() => {
      windowSpy = jest.spyOn(globalThis, 'window', 'get');
    });

    afterEach(() => {
      windowSpy.mockRestore();
    });

    it('should return the string containing red ANSI code and reset at the end', () => {
      windowSpy.mockImplementation(() => undefined);

      const result = colors.red('test');
      const expectedResultRegExp = new RegExp(`\\u001B\\[31mtest\\u001B\\[0m`);

      expect(result).toMatch(expectedResultRegExp);
    });
  });
});
