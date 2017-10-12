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
    css,
    typescript,
    extractText,
    customConfig,
    uglify,
    match,
    file,
    url
} = require('webpack-blocks');
const tslint = require('@webpack-blocks/tslint');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');
const fs = require('fs');

const appPath = (...names) => path.join(process.cwd(), ...names);
const userConfig = require(appPath('webpack.config.js'));

const preprocessor = production => ({
    PRODUCTION: production,
    DEVELOPMENT: !production
});

const ifdef = (opts, block) => (context, utils) => prevConfig => {
    let conf = block(context, utils)(prevConfig);
    const index = conf.module.rules
        .map(
            (r, i) =>
                !Array.isArray(r.test) &&
                r.test.test('name.ts') &&
                r.enforce !== 'pre'
                    ? i
                    : -1
        )
        .reduce((acc, curr) => (acc === -1 && curr !== -1 ? curr : acc), -1);
    conf.module.rules[index].use.push({
        loader: 'ifdef-loader',
        options: opts
    });
    return conf;
};

const tsIfDef = production =>
    ifdef(
        preprocessor(production),
        typescript({
            useCache: true,
            cacheDirectory: 'node_modules/.cache/at-loader'
        })
    );

module.exports = createConfig([
    customConfig(userConfig),
    tslint(),
    match(
        ['*.scss', '*.sass'],
        [
            sass({
                includePaths: [appPath('node_modules')],
                sourceMap: true
            }),
            postcss({
                plugins: [autoprefixer({ browsers: ['last 2 versions'] })]
            }),
            env('production', [extractText('[name].[contenthash:8].css')])
        ]
    ),
    match(['*.eot', '*.ttf', '*.woff', '*.woff2'], [file()]),
    match(
        ['*.gif', '*.jpg', '*.jpeg', '*.png', '*.svg', '*.webp'],
        [url({ limit: 10000 })]
    ),
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
        uglify({
            parallel: true,
            cache: true,
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            }
        }),
        addPlugins([
            new CleanWebpackPlugin([appPath('build')], {
                root: process.cwd()
            }),
            new CopyWebpackPlugin([{ from: 'public', to: '' }])
        ])
    ]),
    env('test', [tsIfDef(true)])
]);
