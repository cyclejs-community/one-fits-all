import { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { HTTPSource, RequestOptions } from '@cycle/http';

export type Sources = {
    DOM : DOMSource;
    HTTP : HTTPSource;
};

export type Sinks = {
    DOM? : Stream<VNode>;
    HTTP? : Stream<RequestOptions>;
};

export type Component = (s : Sources) => Sinks;
