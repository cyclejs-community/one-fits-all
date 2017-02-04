'use strict'

const webpack = require('webpack')

process.env.NODE_ENV = 'production'

const config = require('./configs/webpack.config.js');

const compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) {
    console.log(err)
  }
})
