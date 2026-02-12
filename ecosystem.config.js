module.exports = {
    apps: [
        {
            name: 'wadiaa-ci-api',
            script: 'src/server.js',
            watch: false,
            autorestart: true,
            restart_delay: 1000,
            env_staging: {
                NODE_ENV: 'staging'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        },
        {
            name: 'wadiaa-ci-cron-worker',
            script: 'src/workers/cronWorker.js',
            watch: false,
            autorestart: true,
            restart_delay: 1000,
            env_staging: {
                NODE_ENV: 'staging'
            },
            env_production: {
                NODE_ENV: 'production'
            }
        }
    ]
};
