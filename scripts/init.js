'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');

const devDependencyNames = [
    'cyclejs-test-helpers',
    'snabbdom-looks-like',
    'snabbdom-pragma',
    'prettier',
    'husky',
    'lint-staged',
    '@types/mocha'
];

const ownDevDependencies = ['release-it', 'rxjs', 'rxjs-compat'];

function patchGitignore(appPath) {
    // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
    // See: https://github.com/npm/npm/issues/1862
    const gitignorePath = path.join(appPath, 'gitignore');
    const dotGitignorePath = path.join(appPath, '.gitignore');
    fs.move(gitignorePath, dotGitignorePath, [], err => {
        if (err) {
            // Append if there's already a `.gitignore` file there
            if (err.code === 'EEXIST') {
                const content = fs.readFileSync(gitignorePath);
                fs.appendFileSync(dotGitignorePath, content);
                fs.unlinkSync(gitignorePath);
            } else {
                throw err;
            }
        }
    });
}

function successMsg(appName, appPath, cli) {
    console.log();
    console.log(`Success! Created ${appName} at ${appPath}`);
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(chalk.cyan('  ' + cli + ' start'));
    console.log('    Starts the development server');
    console.log();
    console.log(chalk.cyan('  ' + cli + ' test'));
    console.log('    Start the test runner');
    console.log();
    console.log(chalk.cyan('  ' + cli + ' run build'));
    console.log('    Bundles the app into static files for production');
    console.log();
    console.log(chalk.cyan('  ' + cli + ' run eject'));
    console.log(
        '    Removes this tool and copies build dependencies, configuration files'
    );
    console.log(
        "    and scripts into the app directory. If you do this, you can't go back!"
    );
    console.log();
    console.log('We suggest that you begin by typing:');
    console.log();
    console.log(chalk.cyan(`  cd ${appName}`));
    console.log(chalk.cyan('  ' + cli + ' start'));
    console.log();
    console.log(
        'If you have questions, issues or feedback about Cycle.js and create-cycle-app, please, join us on the Gitter:'
    );
    console.log();
    console.log(chalk.cyan('  https://gitter.im/cyclejs/cyclejs'));
    console.log();
    console.log('Happy cycling!');
    console.log();
}

module.exports = function init(appPath, appName, verboseOpts) {
    const isObj = typeof verboseOpts === 'object';
    const verbose = isObj ? verboseOpts.verbose : verboseOpts;
    const ownPackage = require(path.join(__dirname, '..', 'package.json'));
    const ownPackageName = ownPackage.name;
    const cli = isObj ? verboseOpts.cli : 'npm';
    const ownPath = path.join(appPath, 'node_modules', ownPackageName);
    const appPackageJson = path.join(appPath, 'package.json');
    const appPackage = require(appPackageJson);

    // Manipulate app's package.json
    appPackage.scripts = {
        format: "prettier --write '{src,test}/**/*.{js,jsx,ts,tsx}'",
        start: 'cycle-scripts start',
        test: 'cycle-scripts test',
        build: 'cycle-scripts build',
        eject: 'cycle-scripts eject',
        clean: 'cycle-scripts clean'
    };

    appPackage['lint-staged'] = {
        '*.{js,jsx,ts,tsx}': ['prettier --write', 'git add']
    };
    appPackage.prettier = {
        tabWidth: 4,
        singleQuote: true
    };
    appPackage.husky = {
        hooks: {
            'pre-commit': 'lint-staged'
        }
    };
    appPackage.nyc = {
        instrument: false,
        sourceMap: false,
        include: ['src/components'],
        reporter: ['html', 'text']
    };

    appPackage['mocha-webpack'] = {
        include: ['test/**/*.test.{js,jsx,ts,tsx}']
    };

    const basicDependencies = Object.keys(ownPackage.devDependencies)
        .filter(k => devDependencyNames.indexOf(k) === -1)
        .filter(k => ownDevDependencies.indexOf(k) === -1)
        .map(k => [k, ownPackage.devDependencies[k]])
        .map(([k, v]) => ({ [k]: v }))
        .reduce((a, c) => ({ ...a, ...c }), {});

    const devDependencies = Object.keys(ownPackage.devDependencies)
        .concat(Object.keys(ownPackage.dependencies))
        .filter(k => devDependencyNames.indexOf(k) !== -1)
        .map(k => [
            k,
            ownPackage.devDependencies[k] || ownPackage.dependencies[k]
        ])
        .map(([k, v]) => ({ [k]: v }))
        .reduce((a, c) => ({ ...a, ...c }), {});

    appPackage.dependencies = {
        ...appPackage.dependencies,
        ...basicDependencies
    };
    appPackage.devDependencies = {
        ...appPackage.devDependencies,
        ...devDependencies
    };

    if (cli === 'yarn') {
        appPackage.resolutions = {
            '**/typescript': '2.8'
        };
    }

    fs.writeFileSync(appPackageJson, JSON.stringify(appPackage, null, 2));

    // Copy flavor files
    fs.copySync(path.join(ownPath, 'template'), appPath);
    patchGitignore(appPath);
    if (cli !== 'pnpm') {
        fs.removeSync(path.join(appPath, 'pnpmfile.js'));
    }

    console.log(`Installing dependencies using ${cli}...`);
    console.log();

    const args = ['install'].concat([verbose && '--verbose']).filter(Boolean);

    const code = spawn.sync(cli, args, { stdio: 'inherit', cwd: appPath });
    if (code.status !== 0) {
        console.error(chalk.red('`' + cli + ' ' + args.join(' ') + '` failed'));
    }

    successMsg(appName, appPath, cli);
};
