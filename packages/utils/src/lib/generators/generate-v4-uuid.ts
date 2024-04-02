// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.

/**
 * A functions that generates and returns a v4 UUID string
 *
 * @returns Returns a v4 UUID string
 */
export function generateV4UUID(): string {
  return globalThis.crypto.randomUUID();
}
