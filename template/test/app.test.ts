import { forall, assert, nat, asciistring } from 'jsverify';
import { diagramArbitrary, withTime, addPrevState } from 'cyclejs-test-helpers';
import onionify from 'cycle-onionify';
import { routerify, RouteMatcher } from 'cyclic-router';
import switchPath from 'switch-path';
const htmlLooksLike = require('html-looks-like');
const toHtml = require('snabbdom-to-html'); //snabbdom-to-html's typings are broken

import xs, { Stream } from 'xstream';
import { mockDOMSource, VNode } from '@cycle/dom';
import { mockTimeSource } from '@cycle/time';
import { testOptions } from './testOptions';

import { App, defaultState } from '../src/components/app';
import { defaultState as defaultSpeakerState } from '../src/components/speaker';

export const expectedHTML = (counter: boolean, state: any) => {
    const page: number = counter ? 1 : 2;
    const pageHTML = counter
        ? `<span>Counter: ${state}</span>`
        : `<textarea ${state === '' ? '' : `value="${state}"`}></textarea>`;

    return `
        <div>
            <h2>My Awesome Cycle.js app - Page ${page}</h2>
            {{ ... }}
            ${pageHTML}
            {{ ... }}
        </div>
    `;
};

const createTest = (usePrev: boolean) => () => {
    const property = forall(
        diagramArbitrary,
        nat,
        asciistring,
        (navigationDiagram, count, str) =>
            withTime(Time => {
                const DOM = mockDOMSource({});
                const text = str.replace(/"/, '');
                const navigation$: Stream<boolean> = Time.diagram(
                    navigationDiagram
                ).fold(acc => !acc, true);
                const mockHistory$: Stream<any> = navigation$
                    .map(b => (b ? '/' : '/p2'))
                    .map(s => ({
                        pathname: s,
                        search: '',
                        hash: '',
                        locationKey: ''
                    }));
                const app: any = routerify(
                    onionify(
                        usePrev
                            ? addPrevState(App, {
                                  counter: { count },
                                  speaker: { text }
                              })
                            : App
                    ),
                    switchPath as RouteMatcher
                )({ DOM, history: mockHistory$ } as any);
                const html$ = (app.DOM as Stream<VNode>).map(toHtml);

                const expected$ = navigation$.map(b => {
                    if (usePrev) {
                        if (b) {
                            return expectedHTML(b, count);
                        }
                        return expectedHTML(b, text);
                    }
                    if (b) {
                        return expectedHTML(
                            b,
                            (defaultState.counter as any).count
                        );
                    }
                    return expectedHTML(b, defaultSpeakerState.text);
                });

                Time.assertEqual(html$, expected$, htmlLooksLike);
            })
    );

    return assert(property, testOptions);
};

describe('app tests', () => {
    it('should work without prevState', createTest(false));

    it('should work with prevState', createTest(true));
});
