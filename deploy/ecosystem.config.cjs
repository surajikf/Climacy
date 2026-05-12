const path = require("path");

const appRoot = path.resolve(__dirname, "..");

module.exports = {
  apps: [
    {
      name: "ikf-outreach",
      cwd: appRoot,
      script: "node",
      args: "start-standalone.mjs",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "ikf-worker",
      cwd: appRoot,
      script: "npx",
      args: "tsx -r tsconfig-paths/register scripts/job-worker.ts",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
