import { withTime, addPrevState } from 'cyclejs-test-helpers';
import { assertLooksLike, Wildcard } from 'snabbdom-looks-like';
import { mockDOMSource, VNode } from '@cycle/dom';

import { App } from '../src/components/app';
import { wrapMain } from '../src/drivers';

describe('app tests', () => {
    it('should switch page based on url', () =>
        withTime(Time => {
            const DOM = mockDOMSource({});
            const location$ = Time.diagram('a-b--a--a--b-', {
                a: '/counter',
                b: '/speaker'
            });
            const history = location$.map((p: string) => ({
                pathname: p,
                search: '',
                hash: '',
                locationKey: ''
            }));

            const appWithState = wrapMain(
                addPrevState(App, {
                    speaker: { text: 'THIS IS EXPECTED' }
                })
            );
            const app = wrapMain(App);
            const sinksWithState = app({ DOM, history } as any);
            const sinks = app({ DOM, history } as any);

            const expected$ = Time.diagram('1-2--1--1--2-').map<VNode>(
                (n: string) => (
                    <div>
                        <h2>{`My Awesome Cycle.js app - Page ${n}`}</h2>
                        <Wildcard />
                    </div>
                )
            );

            Time.assertEqual(sinksWithState.DOM!, expected$, assertLooksLike);
            Time.assertEqual(sinks.DOM!, expected$, assertLooksLike);
        }));
});
