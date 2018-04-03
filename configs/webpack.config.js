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
    url,
    resolve
} = require('webpack-blocks');
const webpackMerge = require('webpack-merge');
const tslint = require('@webpack-blocks/tslint');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
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

const ifdef = config => (context, { addLoader }) =>
    addLoader({
        test: /\.tsx?/,
        use: [
            {
                loader: 'awesome-typescript-loader'
            },
            { loader: 'ifdef-loader?' + JSON.stringify(config) }
        ],
        ...context.match
    });

const makeTs = prod =>
    match(
        ['*.js', '*.jsx', '*.ts', '*.tsx'],
        [
            ifdef(preprocessor(prod)),
            typescript({
                useCache: true,
                cacheDirectory: 'node_modules/.cache/at-loader'
            })
        ]
    );

module.exports = webpackMerge(
    createConfig([
        tslint(),
        resolve(['.js', '.jsx']),
        match(
            ['*.scss', '*.sass'],
            [
                postcss({
                    plugins: [autoprefixer({ browsers: ['last 2 versions'] })]
                }),
                sass({
                    includePaths: [appPath('node_modules')],
                    sourceMap: true
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
                alwaysWriteToDisk: true,
                inject: true,
                favicon: 'public/favicon.png',
                hash: true
            }),
            new HtmlWebpackHarddiskPlugin({
                outputPath: appPath('public')
            }),
            new webpack.ProvidePlugin({
                Snabbdom: 'snabbdom-pragma'
            })
        ]),
        env('development', [
            makeTs(false),
            devServer({
                contentBase: appPath('public')
            }),
            sourceMaps(),
            addPlugins([new webpack.NamedModulesPlugin()])
        ]),
        env('production', [
            makeTs(true),
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
        env('test', [makeTs(true)])
    ]),
    userConfig
);
