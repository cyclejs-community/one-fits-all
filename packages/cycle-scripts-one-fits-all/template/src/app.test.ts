import { forall, assert, nat, Options } from 'jsverify';
import * as htmlLooksLike from 'html-looks-like';
const toHtml = require('snabbdom-to-html'); //snabbdom-to-html's typings are broken

import xs, { Stream } from 'xstream';
import { VNode, makeHTMLDriver, mockDOMSource } from '@cycle/dom';
import { mockTimeSource } from '@cycle/time';
import { diagramArbitrary } from './diagramArbitrary';
import onionify from 'cycle-onionify';

import { App } from './app';

const testOptions : Options = {
    tests: 100,
    size: 200
};

function mockStateSource(count : number) : any
{
    return {
        state$: xs.of({ count: count })
    };
}

describe('app tests', () => {

    it('should always print same text', (done) => {
        const staticHTML = count => `
            <div>
                <h2>My Awesome Cycle.js app</h2>
                {{ ... }}
                <button type="button" class="add">Increase</button>
                <button type="button" class="subtract">Decrease</button>
            </div>
        `;

        const property = forall(nat, (n) => {
            const Time = mockTimeSource();
            const DOM = mockDOMSource({});
            const onion = mockStateSource(n);

            const app = App({ DOM, onion } as any);
            const html$ = app.DOM.map(toHtml);

            Time.assertEqual(html$, xs.of(n).map(staticHTML), htmlLooksLike);
            return new Promise((resolve, reject) => Time.run(err => err ? reject(err) : resolve(true)));
        });

        assert(property, testOptions)
            .then(val => val ? done(val) : done())
            .catch(err => done(err));
    });

    const expectedHTML = count => `
        <div>
            {{ ... }}
            <span>Counter: ${count}</span>
            {{ ... }}
        </div>
    `;

    it('should always print the correct number', (done) => {
        const property = forall(nat, (n) => {
            const Time = mockTimeSource();
            const DOM = mockDOMSource({});
            const onion = mockStateSource(n);

            const app = App({ DOM, onion } as any);
            const html$ = app.DOM.map(toHtml);

            Time.assertEqual(html$, xs.of(n).map(expectedHTML), htmlLooksLike);

            return new Promise((resolve, reject) => Time.run(err => err ? reject(err) : resolve(true)));
        });

        assert(property, testOptions)
            .then(val => val ? done(val) : done())
            .catch(err => done(err));
    });

    it('should interact correctly', (done) => {
        const property = forall(diagramArbitrary, diagramArbitrary, (addDiagram, subtractDiagram) => {
            const Time = mockTimeSource();

            const add$ = Time.diagram(addDiagram);
            const subtract$ = Time.diagram(subtractDiagram);

            const DOM = mockDOMSource({
                '.add': { click: add$ },
                '.subtract': { click: subtract$ }
            });

            const app = onionify(App)({ DOM } as any);
            const html$ = app.DOM.map(toHtml);

            const expected$ = xs.merge(add$.mapTo(+1), subtract$.mapTo(-1))
                .fold((acc, curr) => acc + curr, 0)
                .map(expectedHTML);

            Time.assertEqual(html$, expected$, htmlLooksLike);
            return new Promise((resolve, reject) => Time.run(err => err ? reject(err) : resolve(true)));
        });

        assert(property, { ...testOptions, tests: testOptions.tests * 0.4 })
            .then(val => val ? done(val) : done())
            .catch(err => done(err));
    });
});
