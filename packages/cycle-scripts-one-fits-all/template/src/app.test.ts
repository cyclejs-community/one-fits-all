import { forall, assert, nat } from 'jsverify';
import * as htmlLooksLike from 'html-looks-like';
const toHtml : any = require('snabbdom-to-html');

import xs, { Stream } from 'xstream';
import { VNode, makeHTMLDriver, mockDOMSource } from '@cycle/dom';
import { mockTimeSource } from '@cycle/time';

import { App } from './app';

function mockStateSource(count : number) : any
{
    return {
        state$: xs.of({ count: count })
    };
}

describe('app tests', () => {
    const Time : any = mockTimeSource();
    const DOM : any = mockDOMSource({});

    const expectedHTML = count => `
        <div>
            <h2>My awesome Cycle.js app</h2>
            {{ ... }}
        </div>
    `;

    it('should always print same text', done => {
        const property = forall(nat, (n) => {
            const app = App({ DOM, onion: mockStateSource(n) } as any);
            const html$ = app.DOM.compose(toHtml);

            Time.assertEqual(html$, xs.of(n).map(expectedHTML), htmlLooksLike.bool);
            Time.run();
        });

        assert(property);
    });
});
