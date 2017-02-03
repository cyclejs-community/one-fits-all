const { createConfig, defineConstants, env, entryPoint, setOutput, sourceMaps, addPlugins } = require('@webpack-blocks/webpack2');
const babel = require('@webpack-blocks/babel6');
const devServer = require('@webpack-blocks/dev-server2');
const postcss = require('@webpack-blocks/postcss');
const sass = require('@webpack-blocks/sass');
const typescript = require('@webpack-blocks/typescript');
const tslint = require('@webpack-blocks/tslint');
const extractText = require('@webpack-blocks/extract-text2');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = createConfig([
    entryPoint('./src/index.ts'),
    entryPoint('./src/styles.scss'),
    setOutput('./build/bundle.js'),
    babel(),
    typescript(),
    tslint(),
    sass(),
    extractText('[name].css', 'text/x-sass'),
    extractText('[name].css', 'text/css'),
    postcss([
        autoprefixer({ browsers: ['last 2 versions'] })
    ]),
    defineConstants({
        'process.env.NODE_ENV': process.env.NODE_ENV
    }),
    addPlugins([
        new HtmlWebpackPlugin({
            template: './index.ejs',
            inject: true,
            favicon: 'favicon.png',
            hash: true
        }),
        new webpack.ProvidePlugin({
            snabb: 'snabbdom-jsx'
        }),
        new ProgressBarPlugin()
    ]),
    env('development', [
        devServer(),
        devServer.proxy({
            '/api': { target: 'http://localhost:3000' }
        }),
        sourceMaps()
    ]),
    env('production', [
        addPlugins([
            new webpack.optimize.UglifyJsPlugin(),
            new CopyWebpackPlugin([{ from: 'public', to: 'build' }])
        ])
    ])
])
