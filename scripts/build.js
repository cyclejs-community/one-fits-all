'use strict';
const spawn = require('cross-spawn');
const path = require('path');

const env = Object.create(process.env);
env.NODE_ENV = 'production';

const webpack = path.resolve(__dirname, '..', '..', '.bin', 'webpack');

const result = spawn.sync(
    webpack,
    ['--config', path.join(__dirname, '..', 'configs', 'webpack.config.js')],
    { env: env, stdio: 'inherit' }
);

process.exit(result.status);
