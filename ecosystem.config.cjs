// PM2 Ecosystem Configuration for VPS Deployment
// Load .env file to get Firebase credentials
require("./node_modules/dotenv").config();

module.exports = {
  apps: [
    {
      name: "om-app",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/om",
      instances: "max", // Use all CPU cores
      exec_mode: "cluster",
      env_file: ".env", // Load environment variables from .env file
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // Firebase Admin credentials (loaded from .env above)
        FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
        FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,
        // Public Firebase config
        NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        // Other env vars
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        CRON_API_KEY: process.env.CRON_API_KEY,
      },
      // Restart settings
      max_memory_restart: "500M",
      restart_delay: 5000,
      max_restarts: 10,
      // Logging
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "/var/log/pm2/om-error.log",
      out_file: "/var/log/pm2/om-out.log",
      merge_logs: true,
      // Health checks
      watch: false,
      ignore_watch: ["node_modules", ".next", ".git"],
    },
  ],
};
