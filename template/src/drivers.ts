import { makeDOMDriver } from '@cycle/dom';
import { makeHistoryDriver } from '@cycle/history';
import { withState } from '@cycle/state';
import { routerify } from 'cyclic-router';
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
    .concat(['state', 'router']);

export function wrapMain(main: Component<any>): Component<any> {
    return withState(routerify(main as any, switchPath as any)) as any;
}
