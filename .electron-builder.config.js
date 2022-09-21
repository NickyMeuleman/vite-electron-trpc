if (process.env.VITE_APP_VERSION === undefined) {
  const now = new Date();
  process.env.VITE_APP_VERSION = `${now.getUTCFullYear() - 2000}.${
    now.getUTCMonth() + 1
  }.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: "dist",
    buildResources: "buildResources",
  },
  files: [
    "apps/desktop/dist/main/**",
    "apps/desktop/dist/preload/**",
    "apps/web/dist/**",
    "packages/api/dist/**",
    "packages/database/dist/**"
  ],
  extraMetadata: {
    version: process.env.VITE_APP_VERSION,
  },
  extraResources: [
    "buildResources/db.sqlite",
    "node_modules/.prisma/**/*",
    "node_modules/@prisma/client/**/*",
  ],
};

module.exports = config;
