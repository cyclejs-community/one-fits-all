import { setup, run } from '@cycle/run';
import { rerunner } from 'cycle-restart';
import isolate from '@cycle/isolate';
import onionify from 'cycle-onionify';
import storageify from 'cycle-storageify';
/// #if DEVELOPMENT
import { restartable } from 'cycle-restart';
/// #endif

import { buildDrivers } from './drivers';
import { Component } from './interfaces';
import { App } from './components/app';

function wrapMain(main : Component) : Component {
    return onionify(
        storageify(main as any, { key: 'cycle-spa-state' })
    ) as any;
}

const main : Component = wrapMain(App);

/// #if PRODUCTION
run(main as any, buildDrivers(([k, t]) => [k, t()]));

/// #else
const mkDrivers = () =>
    buildDrivers(([k, t]) => {
        if (k === 'DOM') {
            return [k, restartable(t(), { pauseSinksWhileReplaying: false })];
        }
        if (k === 'time' || k === 'router') {
            return [k, t()];
        }
        return [k, restartable(t())];
    });
const rerun = rerunner(setup, mkDrivers, isolate);
rerun(main as any);

if (module.hot) {
    module.hot.accept('./components/app', () => {
        const newApp = (require('./components/app') as any).App;

        rerun(wrapMain(newApp));
    });
}
/// #endif
