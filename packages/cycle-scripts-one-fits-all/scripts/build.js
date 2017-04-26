'use strict'
const path = require('path');
const fs = require('fs');
const merge = require('webpack-merge');
const webpack = require('webpack');
const chalk = require('chalk');

process.env.NODE_ENV = 'production'

const appPath = path.join.bind(null, process.cwd());

const baseConfig = require('../configs/webpack.config.js');
const clientConfig = fs.existsSync(appPath('webpack.config.js')) ?
    require(appPath('webpack.config.js')) : {};

const config = merge(baseConfig, clientConfig);

function printErrors (summary, errors) {
    console.log(chalk.red(summary))
        console.log()
        errors.forEach(err => {
            console.log(err.message || err)
                console.log()
        })
}

let compiler;
try {
    compiler = webpack(config);
} catch(err) {
    console.error('Failed to compiler.', [err]);
    process.exit(1);
}

compiler.run((err, stats) => {
    if (err) {
        printErrors('Failed to compile.', [err]);
        process.exit(1);
    }

    if (stats.compilation.errors.length) {
        printErrors('Failed to compile.', stats.compilation.errors);
        process.exit(1);
    }

    if (process.env.CI && stats.compilation.warnings.length) {
        printErrors(
                'Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.',
                stats.compilation.warnings
                );
        process.exit(1);
    }

    console.log(chalk.green('Compiled successfully.'));
    console.log();
})
}
