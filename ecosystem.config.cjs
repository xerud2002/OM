// PM2 Ecosystem Configuration for VPS Deployment
// Load environment variables from .env.production
const fs = require("fs");
const path = require("path");

// Parse .env file manually (dotenv may not be available at PM2 config load time)
function loadEnvFile(envPath) {
  const env = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split("\n").forEach((line) => {
      // Skip comments and empty lines
      if (!line || line.startsWith("#")) return;
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        let key = match[1].trim();
        let value = match[2].trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[key] = value;
      }
    });
  }
  return env;
}

// Try to load .env.production first, then .env
const cwd = "/var/www/om";
const envVars = {
  ...loadEnvFile(path.join(cwd, ".env")),
  ...loadEnvFile(path.join(cwd, ".env.production")),
};

module.exports = {
  apps: [
    {
      name: "om-app",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: cwd,
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // Spread all loaded environment variables
        ...envVars,
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
