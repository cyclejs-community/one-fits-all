'use strict'
const spawn = require('cross-spawn');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const merge = require('webpack-merge');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

process.env.NODE_ENV = 'development';

const appPath = path.join.bind(null, process.cwd());

const baseConfig = require('../configs/webpack.config.js');
const clientConfig = fs.existsSync(appPath('webpack.config.js')) ?
    require(appPath('webpack.config.js')) : {};

const config = merge(baseConfig, clientConfig);

function run (port) {
    const compiler = webpack(config);

    const devServer = new WebpackDevServer(compiler, {
        quiet: false,
        stats: {
            colors: true
        }
    });

    devServer.listen(port, err => {
        if (err) {
            return console.log(err);
        }

        console.log(chalk.cyan('Starting the development server...'));
        console.log();
    })
}

run(8080)
