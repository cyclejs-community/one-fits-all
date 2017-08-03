'use strict'

const path = require('path')
const spawn = require('cross-spawn')

let env = Object.create( process.env );
env.NODE_ENV = 'test';

const mocha = path.resolve(process.cwd(), 'node_modules', '.bin', 'nyc')

const args = [
  'mocha-webpack',
  '--timeout=100000',
  '--colors',
  '--webpack-config',
  path.join(__dirname, '..', 'configs', 'webpack.config.test.js'),
  'test/**/*.test.*'
].filter(Boolean)

spawn.sync(mocha, args, { env: env, stdio: 'inherit' })
