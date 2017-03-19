import 'babel-polyfill'; //This will be replaced based on your babel-env config

import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';

import { Component } from './interfaces';
import { App } from './app';

const main : Component = App;

const drivers : any = {
    DOM: makeDOMDriver('#app'),
    HTTP: makeHTTPDriver()
};

run(main, drivers);
