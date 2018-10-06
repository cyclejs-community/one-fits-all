import { makeDOMDriver } from '@cycle/dom';
import { makeHistoryDriver } from '@cycle/history';
import { routerify } from 'cyclic-router';
import onionify from 'cycle-onionify';
import switchPath from 'switch-path';

import { Component } from './interfaces';
import speechDriver from './drivers/speech';

export const drivers = {
    DOM: makeDOMDriver('#app'),
    history: makeHistoryDriver(),
    speech: speechDriver
};

export const driverNames = Object.keys(drivers).concat(['onion', 'router']);

export function wrapMain(main: Component<any>): Component<any> {
    return routerify(onionify(main as any), switchPath) as any;
}
