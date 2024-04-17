// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import debug from 'debug';

if (
  process.env &&
  process.env.DEBUG_MULTILINE === 'true' &&
  debug.formatters &&
  debug.formatters.o &&
  debug.formatters.O
)
  debug.formatters.o = debug.formatters.O;

export { debug };
