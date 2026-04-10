module.exports = {
  apps: [
    {
      name: "nextjs-app",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "D:/AI-powered Client Communication Web App",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};