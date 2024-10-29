//@ts-check
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  env: {
    /* eslint-disable @typescript-eslint/naming-convention */
    CONTEXT_ID: process.env.CONTEXT_ID || '',
    SITE_ID: process.env.SITE_ID || '',
    DEBUG_MULTILINE: process.env.DEBUG_MULTILINE || 'false',
    DEBUG: process.env.DEBUG || ''
    /* eslint-enable @typescript-eslint/naming-convention */
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false
  },
  removeConsole: {
    exclude: ['']
  }
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx
];

module.exports = composePlugins(...plugins)(nextConfig);
