/**
 * PM2 Configuration File
 * 
 * התקנה והפעלה:
 * npm install -g pm2
 * npm install -g pm2-windows-startup
 * cd whatsapp-server
 * pm2 start ecosystem.config.js
 * pm2-startup install
 * pm2 save
 */

module.exports = {
  apps: [
    {
      name: 'whatsapp-server',
      script: 'index.js',
      cwd: __dirname,
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
        WHATSAPP_PORT: 3002,
        VIPO_WEBHOOK_URL: 'https://vipo-group.com/api/crm/whatsapp/webhook',
      },
      env_production: {
        NODE_ENV: 'production',
        WHATSAPP_PORT: 3002,
        VIPO_WEBHOOK_URL: 'https://vipo-group.com/api/crm/whatsapp/webhook',
      },
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
