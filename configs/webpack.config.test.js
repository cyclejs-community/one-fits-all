const config = require('./webpack.config.js');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const packageJson = require(path.join(process.cwd(), 'package.json'));

module.exports = Object.assign({}, config, {
    output: {
        // use absolute paths in sourcemaps (important for debugging via IDE)
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    target: 'node',
    devtool: 'inline-source-map',
    externals: [nodeExternals()],
    plugins: config.plugins.filter(p => !(p.options && p.options.template)), //Exclude HtmlWebpackPlugin
    module: Object.assign({}, config.module, {
        rules: packageJson.nyc.include
            .map(s => ({
                test: /\.(jsx?|tsx?)/,
                include: path.resolve(s),
                loader: 'istanbul-instrumenter-loader-fix',
                enforce: 'post',
                options: {
                    esModules: true,
                    fixWebpackSourcePaths: true
                }
            }))
            .concat(config.module.rules)
    })
});
