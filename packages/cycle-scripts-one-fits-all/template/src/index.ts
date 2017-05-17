import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import onionify from 'cycle-onionify';

import { Component, Sources, RootSinks } from './interfaces';
import { App } from './app';

const main : Component = onionify(App);

const defaultSinks : (s : Sources) => RootSinks = sources => Object.assign({
    DOM: xs.never(),
    HTTP: xs.never(),
    onion: xs.never()
}, main(sources));

const drivers : any = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver()
};

run(defaultSinks, drivers);
