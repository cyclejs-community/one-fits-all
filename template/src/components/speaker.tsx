import xs, { Stream } from 'xstream';
import sampleCombine from 'xstream/extra/sampleCombine';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

import { BaseSources, BaseSinks } from '../interfaces';

// Types
export interface Sources extends BaseSources {
    onion: StateSource<State>;
}
export interface Sinks extends BaseSinks {
    onion: Stream<Reducer>;
}

// State
export interface State {
    text: string;
}
export const defaultState: State = { text: 'Edit me!' };
export type Reducer = (prev?: State) => State | undefined;

// Actions
const SPEECH = 'speech',
    NAVIGATE = 'navigate',
    UPDATE = 'update';
interface SpeechAction {
    type: typeof SPEECH;
}
interface NavigationAction {
    type: typeof NAVIGATE;
}
interface UpdateAction {
    type: typeof UPDATE;
    reducer: Reducer;
}
type Action = SpeechAction | NavigationAction | UpdateAction;

export function Speaker({ DOM, onion }: Sources): Sinks {
    const action$: Stream<Action> = intent(DOM);

    return {
        DOM: view(onion.state$),
        speech: speech(action$, onion.state$),
        onion: onionFn(action$),
        router: router(action$)
    };
}

function router(action$: Stream<Action>): Stream<string> {
    return action$.filter(({ type }) => type === NAVIGATE).mapTo('/');
}

function speech(
    action$: Stream<Action>,
    state$: Stream<State>
): Stream<string> {
    return action$
        .filter(({ type }) => type === SPEECH)
        .compose(sampleCombine(state$))
        .map<string>(([_, s]) => s.text);
}

function intent(DOM: DOMSource): Stream<Action> {
    const updateText$: Stream<Action> = DOM.select('#text')
        .events('input')
        .map((ev: any) => ev.target.value)
        .map<Action>((value: string) => ({
            type: UPDATE,
            reducer: () => ({ text: value })
        }));

    const speech$: Stream<Action> = DOM.select('[data-action="speak"]')
        .events('click')
        .mapTo<Action>({ type: SPEECH });

    const navigation$: Stream<Action> = DOM.select('[data-action="navigate"]')
        .events('click')
        .mapTo<Action>({ type: NAVIGATE });

    return xs.merge(updateText$, speech$, navigation$);
}

function onionFn(action$: Stream<Action>): Stream<Reducer> {
    const init$ = xs.of<Reducer>(
        prevState => (prevState === undefined ? defaultState : prevState)
    );

    const update$: Stream<Reducer> = action$
        .filter(({ type }) => type === UPDATE)
        .map<Reducer>((action: UpdateAction) => action.reducer);

    return xs.merge(init$, update$);
}

function view(state$: Stream<State>): Stream<VNode> {
    return state$.map(({ text }) => (
        <div>
            <h2>My Awesome Cycle.js app - Page 2</h2>
            <textarea id="text" rows="3" value={text} />
            <button type="button" data-action="speak">
                Speak to Me!
            </button>
            <button type="button" data-action="navigate">
                Page 1
            </button>
        </div>
    ));
}
