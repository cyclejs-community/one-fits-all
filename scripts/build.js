'use strict';
const spawn = require('cross-spawn');
const path = require('path');

const env = Object.create(process.env);
env.NODE_ENV = 'production';

const webpackAPI = require.resolve('webpack');

const webpack = path.resolve(
    path.dirname(webpackAPI),
    '..',
    'bin',
    'webpack.js'
);

const result = spawn.sync(
    'node',
    [
        webpack,
        '--config',
        path.join(__dirname, '..', 'configs', 'webpack.config.js')
    ],
    { env: env, stdio: 'inherit' }
);

process.exit(result.status);
