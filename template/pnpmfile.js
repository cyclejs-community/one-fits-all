//This is needed so pnpm links the needed webpack loaders in node_modules
module.exports = {
    hooks: {
        readPackage
    }
};

function readPackage(pkg, context) {
    if (pkg['one-fits-all']) {
        pkg.devDependencies = {
            ...pkg.devDependencies,
            tslint: '*',
            jsverify: '*',
            webpack: '*',
            mocha: '*',
            typescript: '2.8',
            'awesome-typescript-loader': '*',
            'style-loader': '*',
            'css-loader': '*',
            'tslint-loader': '*',
            'sass-loader': '*',
            'postcss-loader': '*',
            'istanbul-instrumenter-loader-fix': '*',
            '@types/history': '*',
            'cross-env': '*',
            'mocha-webpack': '2.0.0-beta.0'
        };
        pkg.dependencies = {
            ...pkg.dependencies,
            snabbdom: '*',
            history: '*'
        };
    }

    return pkg;
}
