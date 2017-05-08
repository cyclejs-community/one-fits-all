import { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { HTTPSource, RequestOptions } from '@cycle/http';
import { StateSource } from 'cycle-onionify';

export type Sources = {
    DOM : DOMSource;
    HTTP : HTTPSource;
    onion : StateSource<AppState>;
};

export type RootSinks = {
    DOM : Stream<VNode>;
    HTTP : Stream<RequestOptions>;
    onion : Stream<Reducer>;
};

export type Sinks = Partial<RootSinks>;

export type AppState = {
    count : number;
};

export type Component = (s : Sources) => Sinks;
export type Reducer = (prevState : any) => any;
