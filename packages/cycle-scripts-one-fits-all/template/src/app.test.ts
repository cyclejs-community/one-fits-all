import { forall, assert, nat, json } from 'jsverify';
import * as htmlLooksLike from 'html-looks-like';
const toHtml = require('snabbdom-to-html'); //snabbdom-to-html's typings are broken

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

    it('should always print same text', done => {
        const expectedHTML = count => `
            <div>
                <h2>My awesome Cycle.js app</h2>
                {{ ... }}
            </div>
        `;

        const property = forall(json, (n) => {
            const Time : any = mockTimeSource();
            const DOM : any = mockDOMSource({});

            const app = App({ DOM, onion: mockStateSource(n) } as any);
            const html$ = app.DOM.map(toHtml);

            Time.assertEqual(html$, xs.of(n).map(expectedHTML), htmlLooksLike);

            return new Promise((resolve, reject) => Time.run(err => err ? reject(err) : resolve(true)));
        });

        assert(property)
            .then(val => val ? done(val) : done());
    });

    it('should always print the correct number', done => {
        const expectedHTML = count => `
            <div>
                {{ ... }}
                <span>Counter: ${count}</span>
                {{ ... }}
            </div>
        `;

        const property = forall(nat, (n) => {
            const Time : any = mockTimeSource();
            const DOM : any = mockDOMSource({});

            const app = App({ DOM, onion: mockStateSource(n) } as any);
            const html$ = app.DOM.map(toHtml);

            Time.assertEqual(html$, xs.of(n).map(expectedHTML), htmlLooksLike);

            return new Promise((resolve, reject) => Time.run(err => err ? reject(err) : resolve(true)));
        });

        assert(property)
            .then(val => val ? done(val) : done());
    });

});
