module.exports = ({ config }) => {
    if (process.env.ENVIRONMENT === 'local') {
        config['extra']['API_URL'] = config['extra']['LOCAL_API_URL'];
    }
    return config;
};