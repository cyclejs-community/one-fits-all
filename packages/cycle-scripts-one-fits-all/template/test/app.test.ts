import { forall, assert, nat, Options } from 'jsverify';
import { diagramArbitrary, promise } from 'cyclejs-test-helpers';
import * as htmlLooksLike from 'html-looks-like';
const toHtml = require('snabbdom-to-html'); //snabbdom-to-html's typings are broken

import xs from 'xstream';
import { mockDOMSource } from '@cycle/dom';
import { mockTimeSource } from '@cycle/time';
import onionify from 'cycle-onionify';

import { App } from '../src/app';

const testOptions : Options = {
    tests: 100,
    size: 200
};

describe('app tests', () => {

    const expectedHTML = count => `
        <div>
            <h2>My Awesome Cycle.js app</h2>
            <span>Counter: ${count}</span>
            <button>Increase</button>
            <button>Decrease</button>
        </div>
    `;

    it('should interact correctly', () => {
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
            return promise(Time.run);
        });

        return assert(property, testOptions);
    });
});
