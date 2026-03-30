require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'backend',
      script: 'api/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        APP_PORT: process.env.APP_PORT,
        APP_URL: process.env.APP_URL,
        APP_ORIGIN: process.env.APP_ORIGIN,
        APP_SECRET: process.env.APP_SECRET,
      },
    },
  ],
};