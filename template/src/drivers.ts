import { makeDOMDriver } from '@cycle/dom';
import { makeHistoryDriver } from '@cycle/history';
import { routerify } from 'cyclic-router';
import onionify from 'cycle-onionify';
import switchPath from 'switch-path';

import { Component } from './interfaces';
import speechDriver from './drivers/speech';

const driversFactories: any = {
    DOM: () => makeDOMDriver('#app'),
    history: () => makeHistoryDriver(),
    speech: () => speechDriver
};

export function getDrivers(): any {
    return Object.keys(driversFactories)
        .map(k => ({ [k]: driversFactories[k]() }))
        .reduce((a, c) => ({ ...a, ...c }), {});
}

export const driverNames = Object.keys(driversFactories)
    .filter(name => name !== 'history')
    .concat(['onion', 'router']);

export function wrapMain(main: Component<any>): Component<any> {
    return onionify(routerify(main as any, switchPath as any));
}
