import xs, { Stream } from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import { VNode, DOMSource, div, h2, textarea, button } from '@cycle/dom';

import { Sources, Sinks, Reducer } from '../interfaces';

export interface State {
    text: string;
}
export const defaultState: State = { text: 'Edit me!' };

export interface DOMIntent {
    speech$: Stream<null>;
    link$: Stream<null>;
    updateText$: Stream<string>;
}

export function Speaker({ DOM, state }: Sources<State>): Sinks<State> {
    const { speech$, link$, updateText$ }: DOMIntent = intent(DOM);

    return {
        DOM: view(state.stream),
        speech: speech(speech$, state.stream),
        state: model(updateText$),
        router: redirect(link$)
    };
}

function model(updateText$: Stream<string>): Stream<Reducer<State>> {
    const init$ = xs.of<Reducer<State>>(() => defaultState);

    const update$ = updateText$.map(text => (state: State) => ({
        ...state,
        text
    }));

    return xs.merge(init$, update$);
}

function view(state$: Stream<State>): Stream<VNode> {
    return state$.map(({ text }) =>
        div([
            h2('My Awesome Cycle.js app - Page 2'),
            textarea({
                attrs: { id: 'text', rows: '3' },
                props: { value: text }
            }),
            button(
                { attrs: { type: 'button' }, dataset: { action: 'speak' } },
                ['Speak to Me!']
            ),
            button(
                { attrs: { type: 'button' }, dataset: { action: 'navigate' } },
                ['Page 1']
            )
        ])
    );
}

function intent(DOM: DOMSource): DOMIntent {
    const updateText$ = DOM.select('#text')
        .events('input')
        .map((ev: any) => ev.target.value);

    const speech$ = DOM.select('[data-action="speak"]')
        .events('click')
        .mapTo(null);

    const link$ = DOM.select('[data-action="navigate"]')
        .events('click')
        .mapTo(null);

    return { updateText$, speech$, link$ };
}

function redirect(link$: Stream<any>): Stream<string> {
    return link$.mapTo('/counter');
}

function speech(speech$: Stream<any>, state$: Stream<State>): Stream<string> {
    return speech$
        .compose(sampleCombine(state$))
        .map(([_, s]: [any, State]) => s.text);
}
