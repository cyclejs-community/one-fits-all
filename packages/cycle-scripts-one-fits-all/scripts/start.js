'use strict'

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const port = 8080

const config = require('./configs/webpack.config.js')

const compiler = webpack(config)
const server = new WebpackDevServer(compiler)

server.listen(port)
