// PM2 Ecosystem Configuration for VPS Deployment
module.exports = {
  apps: [
    {
      name: "om-app",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/om",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        FIREBASE_ADMIN_PROJECT_ID: "omro-e5a88",
        FIREBASE_ADMIN_CLIENT_EMAIL: "firebase-adminsdk-8u2x1@omro-e5a88.iam.gserviceaccount.com",
        FIREBASE_ADMIN_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8dJ7nLWoOkOI+\nFnXPPT+qwnb+MmMnQYfxPULkgdLkJL6OXcGZXSBk6U3gQpDmjVLOonxJlXAjJpOt\nreWwbNXQdHJpElvJ+SJnMKTiBKfWC7D2xWJxvwNtR8DfmLpvdvqSamLEuATx1RRJ\nr2Mcb/revXmD02+9t1pZ1rQ4E3EnfmHQz\ne0ygOtdk7qouldA/LZcy0BM=\n-----END PRIVATE KEY-----\n",
        RESEND_API_KEY: "re_aPTzwZ6u_Mq7icMSQQaGNYNy8bgEz92Pw",
        RESEND_FROM_EMAIL: "info@ofertemutare.ro",
        CRON_API_KEY: "7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      },
      max_memory_restart: "500M",
      restart_delay: 5000,
      max_restarts: 10,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      error_file: "/var/log/pm2/om-error.log",
      out_file: "/var/log/pm2/om-out.log",
      merge_logs: true,
      watch: false,
      ignore_watch: ["node_modules", ".next", ".git"],
    },
  ],
};
