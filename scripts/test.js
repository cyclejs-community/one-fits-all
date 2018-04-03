'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const packageJson = require(path.join(process.cwd(), 'package.json'));

let env = Object.create(process.env);
env.NODE_ENV = 'test';

const mocha = path.resolve(process.cwd(), 'node_modules', '.bin', 'nyc');
const mochaArgs = '{' + packageJson['mocha-webpack'].include.join(',') + '}';

const args = [
    'mocha-webpack',
    '--timeout=100000',
    '--colors',
    '--webpack-config',
    path.join(__dirname, '..', 'configs', 'webpack.config.test.js'),
    mochaArgs
].filter(Boolean);

const result = spawn.sync(mocha, args, { env: env, stdio: 'inherit' });

process.exit(result.status);
