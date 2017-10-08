'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const spawn = require('cross-spawn');

const basicDependencies = [
    '@cycle/dom@18.3.0',
    '@cycle/history@6.4.0',
    '@cycle/http@14.4.0',
    '@cycle/isolate@3.1.0',
    '@cycle/run@3.3.0',
    '@cycle/storage@4.1.1',
    '@cycle/time@0.10.1',
    'cycle-onionify@4.0.0',
    'cyclejs-utils@1.0.4',
    'cycle-storageify@3.2.0',
    'cyclic-router@5.1.3',
    'switch-path@1.2.0',
    'xstream@11.0.0'
];

const devDependencies = [
    '@types/history@4.6.0',
    'cycle-restart@0.2.2',
    'cyclejs-test-helpers@1.4.0',
    'html-looks-like@1.0.3',
    'jsverify@0.8.3',
    'prettier@1.7.4',
    'snabbdom-to-html@3.3.0'
];

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

function successMsg(appName, appPath) {
    console.log();
    console.log(`Success! Created ${appName} at ${appPath}`);
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(chalk.cyan('  npm start'));
    console.log('    Starts the development server');
    console.log();
    console.log(chalk.cyan('  npm test'));
    console.log('    Start the test runner');
    console.log();
    console.log(chalk.cyan('  npm run build'));
    console.log('    Bundles the app into static files for production');
    console.log();
    console.log(chalk.cyan('  npm run eject'));
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
    console.log(chalk.cyan('  npm start'));
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
    console.log(appPath);
    const isObj = typeof verboseOpts === 'object';
    const verbose = isObj ? verboseOpts.verbose : verboseOpts;
    const ownPackageName = require(path.join(__dirname, '..', 'package.json'))
        .name;
    const cli = isObj ? verboseOpts.cli : 'npm';
    const ownPath = path.join(appPath, 'node_modules', ownPackageName);
    const appPackageJson = path.join(appPath, 'package.json');
    const appPackage = require(appPackageJson);

    // Manipulate app's package.json
    appPackage.dependencies = appPackage.dependencies || {};
    appPackage.devDependencies = appPackage.devDependencies || {};
    appPackage.scripts = {
        precommit: 'lint-staged',
        format:
            "prettier --tab-width 4 --single-quote --write './**/*.{js,jsx,ts,tsx}'",
        start: 'cycle-scripts start',
        test: 'cycle-scripts test',
        build: 'cycle-scripts build',
        eject: 'cycle-scripts eject',
        clean: 'cycle-scripts clean'
    };

    appPackage.lintStaged = {
        './**/*.{js,jsx,ts,tsx}': ['npm run format', 'git add']
    };
    appPackage.nyc = {
        instrument: false,
        sourceMap: false,
        include: ['src/components'],
        reporter: ['html', 'text-summary']
    };

    appPackage['mocha-webpack'] = {
        include: [
            'src/components/**/*.{jsx,js,ts,tsx}',
            'test/**/*.test.{js,jsx,ts,tsx}'
        ]
    };

    fs.writeFileSync(appPackageJson, JSON.stringify(appPackage, null, 2));

    // Copy flavor files
    fs.copySync(path.join(ownPath, 'template'), appPath);
    patchGitignore(appPath);

    installList(basicDependencies, '--save', verbose, cli, appPath);
    installList(devDependencies, '--save-dev', verbose, cli, appPath);

    successMsg(appName, appPath);
};

function installList(list, mode, verbose, cli, appPath) {
    const listOfbasicDependencies = list
        .slice(0, list.length - 1)
        .join(', ')
        .concat(` and ${list.slice(-1)}`);

    console.log(`Installing ${listOfbasicDependencies} using npm...`);
    console.log();

    const args = [cli === 'npm' ? 'install' : 'add']
        .concat(list)
        .concat([mode, verbose && '--verbose'])
        .filter(Boolean);

    const code = spawn.sync(cli, args, { stdio: 'inherit', cwd: appPath });
    if (code.status !== 0) {
        console.error(chalk.red('`' + cli + ' ' + args.join(' ') + '` failed'));
    }
}
