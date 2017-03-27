'use strict'

const path = require('path')
const spawn = require('cross-spawn')
const chalk = require('chalk')

const mocha = path.resolve(process.cwd(), 'node_modules', '.bin', 'mocha-webpack')

const args = [
  '--colors',
  '--webpack-config',
  path.join(__dirname, 'configs', 'webpack.config.test.js'),
  'src/**/*.test.*'
].filter(Boolean)

spawn(mocha, args, {stdio: 'inherit'})
