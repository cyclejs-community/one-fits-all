import xs from 'xstream';
import { withTime, addPrevState } from 'cyclejs-test-helpers';
import { assertLooksLike, Wildcard } from 'snabbdom-looks-like';
import { mockDOMSource, VNode, div, span } from '@cycle/dom';

import { Counter } from '../src/components/counter';
import { wrapMain } from '../src/drivers';

describe('counter tests', () => {
    it(
        'should count up and down',
        withTime(Time => {
            const DOM = mockDOMSource({
                '.add': {
                    click: Time.diagram('----x-x---x-x-x-x--x-x--x')
                },
                '.subtract': {
                    click: Time.diagram('--x----x---------xx----x-')
                }
            });
            const history = xs.never();

            const sinks: any = wrapMain(Counter)({ DOM, history } as any);
            const _sinks: any = wrapMain(addPrevState(Counter, { count: 5 }))({
                DOM,
                history
            } as any);

            const expected$ = Time.diagram('0-a-0-10--1-2-3-4323-4-34', {
                a: -1
            });
            const _expected$ = Time.diagram('5-4-5-65--6-7-8-9878-9-89');

            const expectedDOM = (n: string) =>
                div([Wildcard(), span(`Counter: ${n}`), Wildcard()]);

            Time.assertEqual(
                sinks.DOM,
                expected$.map(expectedDOM),
                assertLooksLike
            );
            Time.assertEqual(
                _sinks.DOM,
                _expected$.map(expectedDOM),
                assertLooksLike
            );
        })
    );

    it(
        'should redirect to /speaker on button press',
        withTime(Time => {
            const diagram = '--x-----x--';
            const DOM = mockDOMSource({
                '[data-action="navigate"]': {
                    click: Time.diagram(diagram)
                }
            });
            const history = xs.merge(xs.of('/counter'), xs.never());

            const sinks: any = wrapMain(Counter)({ DOM, history } as any);

            const expected$ = Time.diagram(diagram, {
                x: '/speaker'
            });

            Time.assertEqual(sinks.router, expected$);
        })
    );
});
