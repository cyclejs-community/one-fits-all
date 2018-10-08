#!/usr/bin/env node
'use strict';

const spawn = require('cross-spawn');
const script = process.argv[2];
const args = process.argv.slice(3);
const path = require('path');
const rimraf = require('rimraf');

const appPath = (...paths) => path.join(process.cwd(), ...paths);

switch (script) {
    case 'clean':
        rimraf.sync(appPath('.nyc_output'));
        rimraf.sync(appPath('build'));
        rimraf.sync(appPath('coverage'));
        break;
    case 'start':
    case 'test':
    case 'build':
    case 'eject':
        const result = spawn.sync(
            'node',
            [require.resolve('./scripts/' + script)].concat(args),
            { stdio: 'inherit' }
        );
        process.exit(result.status);
        break;
    default:
        console.log('Unknown script "' + script + '".');
        console.log('Perhaps you need to upgrade cycle-scripts?');
        break;
}
