import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { HTTPSource, RequestOptions } from '@cycle/http';
import { TimeSource } from '@cycle/time';
import { RouterSource } from 'cyclic-router';

<<<<<<< HEAD
export type Sources = {
    DOM: DOMSource;
    HTTP: HTTPSource;
    Time: TimeSource;
};

export type RootSinks = {
    DOM: Stream<VNode>;
    HTTP: Stream<RequestOptions>;
};

export type Sinks = Partial<RootSinks>;
export type Component = (s: Sources) => Sinks;
=======
export type Component = (s : BaseSources) => BaseSinks;

export interface BaseSources {
    DOM : DOMSource;
    HTTP : HTTPSource;
    time : TimeSource;
    router : RouterSource;
    storage : any;
}

export interface BaseSinks {
    DOM? : Stream<VNode>;
    HTTP? : Stream<RequestOptions>;
    router? : RouterSink;
    storage? : Stream<any>;
    speech? : Stream<string>;
}
>>>>>>> Add new SPA template
