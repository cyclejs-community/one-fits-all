import xs, { Stream } from 'xstream';
import { restartable } from 'cycle-restart';
import { makeDOMDriver } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http';
import { timeDriver } from '@cycle/time';
import { makeRouterDriver, RouteMatcher } from 'cyclic-router';
import { createBrowserHistory } from 'history';
import switchPath from 'switch-path';
import storageDriver from '@cycle/storage';

import speechDriver from './drivers/speech';

export type DriverThunk = Readonly<[string, () => any]> & [string, () => any] // work around readonly
export type DriverThunkMapper = ( t : DriverThunk) => DriverThunk;

// Set of Drivers used in this App
const driverThunks : DriverThunk[] = [
    ['DOM', () => makeDOMDriver('#app')],
    ['HTTP', () => makeHTTPDriver()],
    ['time', () => timeDriver],
    [
        'router',
        () =>
            makeRouterDriver(createBrowserHistory(), switchPath as RouteMatcher)
    ],
    ['storage', () => storageDriver],
    ['speech', () => speechDriver]
];

export const buildDrivers = (fn : DriverThunkMapper) =>
    driverThunks
        .map(fn)
        .map(([n, t] : DriverThunk) => ({ [n]: t }))
        .reduce((a, c) => Object.assign(a, c), {});

export const driverNames = driverThunks.map(([n, t]) => n).concat(['onion']);
