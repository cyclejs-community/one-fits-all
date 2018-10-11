'use strict';
const spawn = require('cross-spawn');
const path = require('path');

const env = Object.create(process.env);
env.NODE_ENV = 'development';

const webpackAPI = require.resolve('webpack-dev-server');

const webpack = path.resolve(
    path.dirname(webpackAPI),
    '..',
    'bin',
    'webpack-dev-server.js'
);

spawn.sync(
    webpack,
    ['--config', path.join(__dirname, '..', 'configs', 'webpack.config.js')],
    { env: env, stdio: 'inherit' }
);
