import { setup, run } from '@cycle/run';
import isolate from '@cycle/isolate';
/// #if DEVELOPMENT
import { restartable, rerunner } from 'cycle-restart';
/// #endif

import { buildDrivers, wrapMain } from './drivers';
import { Component } from './interfaces';
import { App } from './components/app';

const main: Component = wrapMain(App);

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
