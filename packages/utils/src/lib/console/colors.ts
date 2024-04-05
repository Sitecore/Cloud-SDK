// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * The functions provided in the module work only in node environments an chromium based browsers.
 * The public functions will do the required checks internally so no extra work needed outside this module.
 * If colors are supported they will be applied and the colorized version of the text will be returned,
 * otherwise the original text will be returned.
 */

/* eslint-disable @typescript-eslint/naming-convention */
/**
 * The ANSI CODES for colors needed in the SDK
 */
const COLORS = {
  BLUE: '\u001B[34m',
  CYAN: '\u001B[36m',
  GREEN: '\u001B[32m',
  RED: '\u001B[31m',
  RESET: '\u001B[0m',
  YELLOW: '\u001B[33m',
} as const;
/* eslint-enable @typescript-eslint/naming-convention */

/**
 * Checks if the browser is based on chromium
 * @returns true if the browser is based on chromium and false otherwise
 */
function isChromiumBrowser(): boolean {
  return navigator.userAgent.includes('Chrome');
}

/**
 * Checks if the current running environment is browser
 * @returns true if the environment is browser and false otherwise
 */
function isBrowserEnvironment(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Checks if the current running environment supports colors
 * @returns true if the environment supports colors and false otherwise
 */
function isColorsSupported() {
  return (isBrowserEnvironment() && isChromiumBrowser()) || !isBrowserEnvironment();
}

/**
 * Checks and applies the color if the environment supports colors
 * @returns the colorized string if supported or the original text
 */
function colorizeText<T extends typeof COLORS>(color: T[keyof T], text: string) {
  return isColorsSupported() ? `${color}${text}${COLORS.RESET}` : text;
}

/**
 * A function changes the text to red color if in supported environment
 * @returns A string with \\u001B[31m prefix and \\u001B[0m suffix or the original text
 */
export function red(text: string): string {
  return colorizeText(COLORS.RED, text);
}

/**
 * A function changes the text to blue color if in supported environment
 * @returns A string with \\u001B[34m prefix and \\u001B[0m suffix or the original text
 */
export function blue(text: string): string {
  return colorizeText(COLORS.BLUE, text);
}

/**
 * A function changes the text to cyan color if in supported environment
 * @returns A string with \\u001B[36m prefix and \\u001B[0m suffix or the original text
 */
export function cyan(text: string): string {
  return colorizeText(COLORS.CYAN, text);
}

/**
 * A function changes the text to green color if in supported environment
 * @returns A string with \\u001B[32m prefix and \\u001B[0m suffix or the original text
 */
export function green(text: string): string {
  return colorizeText(COLORS.GREEN, text);
}

/**
 * A function changes the text to yellow color if in supported environment
 * @returns A string with \\u001B[33m prefix and \\u001B[0m suffix or the original text
 */
export function yellow(text: string): string {
  return colorizeText(COLORS.YELLOW, text);
}
