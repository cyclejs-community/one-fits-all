import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

import { Sources, Sinks } from './interfaces';

export type AppSources = Sources & { onion : StateSource<AppState> };
export type AppSinks = Sinks & { onion : Stream<Reducer> };
export type Reducer = (prev : AppState) => AppState;
export type AppState = {
    count : number;
};

export function App(sources : AppSources) : AppSinks
{
    const action$ : Stream<Reducer> = intent(sources.DOM);
    const vdom$ : Stream<VNode> = view(sources.onion.state$);

    return {
        DOM: vdom$,
        onion: action$
    };
}

function intent(DOM : DOMSource) : Stream<Reducer>
{
    const init$ : Stream<Reducer> = xs.of<Reducer>(() => ({ count: 0 }));

    const add$ : Stream<Reducer> = DOM.select('.add').events('click')
        .mapTo<Reducer>(state => ({ ...state, count: state.count + 1 }));

    const subtract$ : Stream<Reducer> = DOM.select('.subtract').events('click')
        .mapTo<Reducer>(state => ({ ...state, count: state.count - 1 }));

    return xs.merge(init$, add$, subtract$);
}

function view(state$ : Stream<AppState>) : Stream<VNode>
{
    return state$
        .map(s => s.count)
        .map(count =>
            <div>
                <h2>My Awesome Cycle.js app</h2>
                <span>{ 'Counter: ' + count }</span>
                <button type='button' className='add'>Increase</button>
                <button type='button' className='subtract'>Decrease</button>
            </div>
        );
}
