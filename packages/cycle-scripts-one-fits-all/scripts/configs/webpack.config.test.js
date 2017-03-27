const config = require('./webpack.config.js');
const nodeExternals = require('webpack-node-externals');

module.exports = Object.assign({}, config, {
    target: 'node',
    externals: [nodeExternals()],
    plugins: config.plugins
        .filter(p => !(p.options && p.options.template)) //Exclude HtmlWebpackPlugin
});
