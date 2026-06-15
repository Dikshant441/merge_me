module.exports = {
  apps: [
    {
      name: "mergeme",
      script: "pnpm",
      args: "start",
      cwd: "/home/ubuntu/merge_me/backend",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
