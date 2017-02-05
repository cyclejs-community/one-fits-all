import { Stream } from 'xstream';
import { VNode } from '@cycle/dom';
import { DOMSource } from '@cycle/dom/xstream-typings';
import { HTTPSource, RequestOptions } from '@cycle/http';

export interface Sources
{
    DOM : DOMSource;
    HTTP : HTTPSource;
}

export interface Sinks
{
    DOM? : Stream<VNode>;
    HTTP? : Stream<RequestOptions>;
}

export type Component = (s : Sources) => Sinks;
