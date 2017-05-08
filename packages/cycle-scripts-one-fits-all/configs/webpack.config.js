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
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

const path = require('path');
const fs = require('fs');
const merge = require('deepmerge');

const appPath = file => path.join(process.cwd(), file);
const packageJson = require(appPath('package.json'));
const babelConfig = fs.existsSync(appPath('babelrc.json')) ? require('./babelrc.json') : {};
const babelrc = fs.existsSync(appPath('.babelrc')) ? merge(babelConfig, JSON.parse(fs.readFileSync(appPath('.babelrc', 'utf-8')))) : babelConfig;

const tsconfigPath = fs.existsSync(path.join(process.cwd(), 'tsconfig.json')) ? path.join(process.cwd(), 'tsconfig.json') : path.join(__dirname, 'tsconfig.json');

const customConfig = fs.existsSync(appPath('webpack.config.js')) ?
    require(appPath('webpack.config.js')) :
    {};

module.exports = createConfig([
    () => customConfig, //Include user config
    entryPoint(path.join(process.cwd(), 'src', 'index.ts')),
    entryPoint(path.join(process.cwd(), 'src', 'css', 'styles.scss')),
    setOutput(path.join(process.cwd(), 'build', 'bundle.[hash].js')),
    babel(Object.assign({}, babelrc, { cacheDirectory: true })),
    typescript({
        configFileName: tsconfigPath,
        useBabel: true,
        babelOptions: babelrc,
        useCache: true,
        cacheDirectory: 'node_modules/.cache/at-loader'
    }),
    tslint(),
    sass(),
    extractText('[name].css', 'text/x-sass'),
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
            favicon: 'public/favicon.png',
            hash: true
        }),
        new webpack.ProvidePlugin({
            Snabbdom: 'snabbdom-pragma'
        })
    ]),
    env('development', [
        devServer(),
        sourceMaps()
    ]),
    env('production', [
        addPlugins([
            new BabiliPlugin(),
            new CopyWebpackPlugin([{ from: 'public', to: '' }])
        ])
    ])
])
