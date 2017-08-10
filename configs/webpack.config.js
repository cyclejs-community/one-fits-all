const {
    createConfig,
    defineConstants,
    env,
    entryPoint,
    setOutput,
    sourceMaps,
    addPlugins,
    devServer,
    postcss,
    sass,
    typescript,
    extractText,
    customConfig,
    uglify
} = require('webpack-blocks');
const tslint = require('@webpack-blocks/tslint');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');
const fs = require('fs');

const userConfig = require(appPath('webpack.config.js'));

const preprocessor = production => ({
    PRODUCTION: production,
    DEVELOPMENT: !production
});

const ifdef = (opts, block) => (context, utils) => {
    let conf = block(context, utils);
    conf.module.loaders[0].loaders.push(
        `ifdef-loader?json=${JSON.stringify(opts)}`
    );
    return utils.merge(conf);
};

const tsIfDef = production =>
    ifdef(
        preprocessor(production),
        typescript({
            useCache: true,
            cacheDirectory: 'node_modules/.cache/at-loader'
        })
    );

const appPath = (...names) => path.join(process.cwd(), ...names);

module.exports = createConfig([
    customConfig(userConfig), //Include user config
    tslint(),
    sass(),
    postcss([autoprefixer({ browsers: ['last 2 versions'] })]),
    defineConstants({
        'process.env.NODE_ENV': process.env.NODE_ENV
    }),
    addPlugins([
        new HtmlWebpackPlugin({
            template: './index.ejs',
            inject: true,
            favicon: 'public/favicon.png',
            hash: true
        }),
        new webpack.ProvidePlugin({
            Snabbdom: 'snabbdom-pragma'
        })
    ]),
    env('development', [
        tsIfDef(false),
        devServer(),
        sourceMaps(),
        addPlugins([new webpack.NamedModulesPlugin()])
    ]),
    env('production', [
        tsIfDef(true),
        extractText('[name].css', 'text/x-sass'),
        uglify(),
        addPlugins([
            new CleanWebpackPlugin([appPath('build')], {
                root: process.cwd()
            }),
            new CopyWebpackPlugin([{ from: 'public', to: '' }]),
        ])
    ]),
    env('test', [tsIfDef(true)])
]);
