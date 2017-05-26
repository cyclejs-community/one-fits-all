import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import onionify from 'cycle-onionify';

import { Component, Sources, RootSinks } from './interfaces';
import { App } from './app';

const main : Component = onionify(App);

const drivers : any = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver()
};
export const driverNames : string[] = Object.keys(drivers);

// Cycle apps (main functions) are allowed to return any number of sinks streams
// This sets defaults for all drivers that are not used by the app
const defaultSinks : (s : Sources) => RootSinks = sources => ({
    ...driverNames.map(n => ({ [n]: xs.never() })).reduce(Object.assign, {}),
    ...main(sources)
});

run(defaultSinks, drivers);
