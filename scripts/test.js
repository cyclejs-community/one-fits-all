'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const packageJson = require(path.join(process.cwd(), 'package.json'));

let env = Object.create(process.env);
env.NODE_ENV = 'test';

const nycAPI = require.resolve('nyc');
const nyc = path.resolve(
    nycAPI.slice(0, nycAPI.lastIndexOf('/')),
    'bin',
    'nyc.js'
);

const args = [
    'mocha-webpack',
    '--colors',
    '--webpack-config',
    path.join(__dirname, '..', 'configs', 'webpack.config.js'),
    ...packageJson['mocha-webpack'].include
].filter(Boolean);

const result = spawn.sync(nyc, args, { env: env, stdio: 'inherit' });

process.exit(result.status);
