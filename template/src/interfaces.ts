import { Stream } from 'xstream';
import { DOMSource, VNode } from '@cycle/dom';
import { RouterSource, HistoryAction } from 'cyclic-router';
import { StateSource, Reducer } from 'cycle-onionify';

export { Reducer } from 'cycle-onionify';

export type Component<State> = (s: Sources<State>) => Sinks<State>;

export interface Sources<State> {
    DOM: DOMSource;
    router: RouterSource;
    onion: StateSource<State>;
}

export interface Sinks<State> {
    DOM?: Stream<VNode>;
    router?: Stream<HistoryAction>;
    speech?: Stream<string>;
    onion?: Stream<Reducer<State>>;
}
