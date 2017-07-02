module.exports = {
    // Secret key for JWT signing and encryption
    'secret': 'iad-ease-server-secret-passphrase',
    // Database connection information
    'database': 'mongodb://localhost/iad',
    // Setting port for server
    'port': process.env.PORT || 3030,
    'portBrowserSync': 3000,
    'portNodemon': 8000
};