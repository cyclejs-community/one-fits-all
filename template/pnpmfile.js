//This is needed so pnpm links the needed webpack loaders in node_modules
module.exports = {
    hooks: {
        readPackage
    }
};

function readPackage(pkg, context) {
    if (
        pkg.devDependencies &&
        pkg.devDependencies['cycle-scripts-one-fits-all']
    ) {
        pkg.devDependencies = {
            ...pkg.devDependencies,
            'awesome-typescript-loader': '*',
            'style-loader': '*',
            'css-loader': '*',
            'tslint-loader': '*',
            'sass-loader': '*',
            'postcss-loader': '*',
            tslint: '*',
            '@types/history': '*'
        };
        pkg.dependencies = {
            ...pkg.dependencies,
            snabbdom: '*',
            history: '*'
        };
    }

    return pkg;
}
