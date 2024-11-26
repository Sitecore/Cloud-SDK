//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  env: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    CONTEXT_ID: process.env.CONTEXT_ID || '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    DEBUG_MULTILINE: process.env.DEBUG_MULTILINE || 'false',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SITE_NAME: process.env.SITE_NAME || ''
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false
  }
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx
];

module.exports = composePlugins(...plugins)(nextConfig);
