import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';

import { Sources, Sinks, Reducer } from './interfaces';

export type AppState = {
    count : number;
}

export function App(sources : Sources) : Sinks
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
    const init$ : Stream<Reducer> = xs.of(() => ({ count: 0 }));

    const add$ : Stream<Reducer> = DOM.select('.add').events('click')
        .mapTo(state => ({ ...state, count: state.count + 1 }));

    const subtract$ : Stream<Reducer> = DOM.select('.subtract').events('click')
        .mapTo(state => ({ ...state, count: state.count - 1 }));

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
