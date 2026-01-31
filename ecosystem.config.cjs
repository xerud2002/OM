// PM2 Ecosystem Configuration for VPS Deployment
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
