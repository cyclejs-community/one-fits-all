'use strict'
const spawn = require('cross-spawn');
const path = require('path');

let env = Object.create( process.env );
env.NODE_ENV = 'production';

const webpack = path.resolve(__dirname, '..', '..', '.bin', 'webpack');

spawn(webpack, ['--config', path.join(__dirname, '..', 'configs', 'webpack.config.js')], { env: env, stdio: 'inherit' } );
