import { forall, assert, asciistring } from 'jsverify';
import { diagramArbitrary, withTime, addPrevState } from 'cyclejs-test-helpers';
import onionify from 'cycle-onionify';
const htmlLooksLike = require('html-looks-like');
const toHtml = require('snabbdom-to-html'); //snabbdom-to-html's typings are broken

import xs, { Stream } from 'xstream';
import { mockDOMSource, VNode } from '@cycle/dom';
import { mockTimeSource } from '@cycle/time';
import { testOptions } from './testOptions';

import { Speaker, defaultState } from '../src/components/speaker';

export const expectedHTML = (content: string) => `
    <div>
        <h2>My Awesome Cycle.js app - Page 2</h2>
        <textarea${content !== '' ? ` value="${content}"` : ''}></textarea>
        <button>Speak to Me!</button>
        <button>Page 1</button>
    </div>
`;

const createTest = (usePrev: boolean) => () => {
    const property = forall(
        diagramArbitrary,
        asciistring,
        (inputDiagram, str) =>
            withTime(Time => {
                const text = str.replace(/"/, '');
                const input$ = Time.diagram(inputDiagram).map(s => ({
                    target: { value: s }
                }));

                const DOM = mockDOMSource({
                    '#text': { input: input$ }
                });

                const app: any = onionify(
                    usePrev ? addPrevState(Speaker, { text }) : Speaker
                )({ DOM } as any);
                const html$ = (app.DOM as Stream<VNode>).map(toHtml);

                const expected$ = input$
                    .map(ev => ev.target.value)
                    .startWith(usePrev ? text : defaultState.text)
                    .map(expectedHTML);

                Time.assertEqual(html$, expected$, htmlLooksLike);
            })
    );

    return assert(property, testOptions);
};

describe('speaker tests', () => {
    it('should work without prevState', createTest(true));

    it('should work with prevState', createTest(false));

    it('should navigate', () => {
        const property = forall(diagramArbitrary, clickDiagram =>
            withTime(Time => {
                const click$ = Time.diagram(clickDiagram);

                const DOM = mockDOMSource({
                    '[data-action="navigate"]': { click: click$ }
                });

                const app = onionify(Speaker)({ DOM } as any);
                const router$ = app.router as Stream<string>;

                const expected$ = click$.mapTo('/');

                Time.assertEqual(router$, expected$);
            })
        );

        return assert(property, testOptions);
    });

    it('should output state on speech', () => {
        const property = forall(
            diagramArbitrary,
            asciistring,
            (clickDiagram, text) =>
                withTime(Time => {
                    const click$ = Time.diagram(clickDiagram);

                    const DOM = mockDOMSource({
                        '[data-action="speak"]': { click: click$ }
                    });

                    const app: any = onionify(addPrevState(Speaker, { text }))({
                        DOM
                    } as any);
                    const speech$ = app.speech as Stream<string>;

                    const expected$ = click$.mapTo(text);

                    Time.assertEqual(speech$, expected$);
                })
        );

        return assert(property, testOptions);
    });
});
