import { withTime, addPrevState } from 'cyclejs-test-helpers';
import { assertLooksLike, Wildcard } from 'snabbdom-looks-like';
import { mockDOMSource, VNode } from '@cycle/dom';

import { App } from '../src/components/app';
import { wrapMain } from '../src/drivers';

function fakeLocationObj(path: string): any {
    return {
        pathname: path,
        search: '',
        hash: '',
        locationKey: ''
    };
}

describe('app tests', () => {
    it(
        'should switch page based on url',
        withTime(Time => {
            const DOM = mockDOMSource({});
            const history = Time.diagram('a-b--a--a--b-', {
                a: '/counter',
                b: '/speaker'
            }).map(fakeLocationObj);

            const sinks: any = wrapMain(App)({ DOM, history } as any);
            const sinksWithState: any = wrapMain(
                addPrevState(App, {
                    speaker: { text: 'THIS IS EXPECTED' },
                    counter: 5
                })
            )({ DOM, history } as any);

            const expected$ = Time.diagram('1-2--1--1--2-').map<VNode>(
                (n: string) => (
                    <div>
                        <h2>{`My Awesome Cycle.js app - Page ${n}`}</h2>
                        <Wildcard />
                    </div>
                )
            );

            Time.assertEqual(sinks.DOM, expected$, assertLooksLike);
            Time.assertEqual(sinksWithState.DOM, expected$, assertLooksLike);
        })
    );

    it(
        'should redirect to /counter from /',
        withTime(Time => {
            const DOM = mockDOMSource({});
            const history = Time.diagram('r--r--', {
                r: '/'
            }).map(fakeLocationObj);

            const sinks = wrapMain(App)({ DOM, history } as any);

            const expected$ = Time.diagram('a--a--', {
                a: '/counter'
            });

            Time.assertEqual(sinks.router!, expected$);
        })
    );
});
