/**
 * Global adapter config
 *
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.adapters = {

    'default': process.env.NODE_ENV || 'development',

    development: {
        module: 'sails-mysql',
        host: 'localhost',
        user: 'todouser',
        password: 'todopass',
        database: 'todomvc',
        pool: true,
        connectionLimit: 2,
        waitForConnections: true
    },

    production: {
        module: 'sails-mysql',
        host: process.env.MYSQLS_HOSTNAME,
        user: process.env.MYSQLS_USERNAME,
        password: process.env.MYSQLS_PASSWORD,
        database: process.env.MYSQLS_DATABASE,
        pool: true,
        connectionLimit: 2,
        waitForConnections: true
    }
};
