import xs from 'xstream';
import { withTime, addPrevState } from 'cyclejs-test-helpers';
import { assertLooksLike, Wildcard } from 'snabbdom-looks-like';
import { mockDOMSource, VNode } from '@cycle/dom';

import { Speaker } from '../src/components/speaker';
import { wrapMain } from '../src/drivers';

describe('speaker tests', () => {
    it(
        'should update text when typing',
        withTime(Time => {
            let str = '';
            const timeValues: any = {};
            for (const s of 'abcdefg') {
                str += s;
                timeValues.s = str;
            }
            for (const s of 'uvwxyz') {
                str = str.slice(-1);
                timeValues.s = str;
            }

            const diagram = '-abcdefg--u-vwx-y-z';
            const DOM = mockDOMSource({
                '#text': {
                    input: Time.diagram(diagram, timeValues).map(value => ({
                        target: { value }
                    }))
                }
            });
            const history = xs.never();

            const sinks: any = wrapMain(Speaker)({ DOM, history } as any);

            const expected$ = Time.diagram('o' + diagram.slice(1), {
                ...timeValues,
                o: 'Edit me!'
            });

            const expectedDOM = (s: string) => (
                <div>
                    <h2>My Awesome Cycle.js app - Page 2</h2>
                    <textarea attrs-id="text" value={s} />
                    <Wildcard />
                </div>
            );

            Time.assertEqual(
                sinks.DOM,
                expected$.map(expectedDOM),
                assertLooksLike
            );
        })
    );

    it(
        'should redirect to /counter on button press',
        withTime(Time => {
            const diagram = '--x-----x--';
            const DOM = mockDOMSource({
                '[data-action="navigate"]': {
                    click: Time.diagram(diagram)
                }
            });
            const history = xs.never();

            const sinks: any = wrapMain(Speaker)({ DOM, history } as any);

            const expected$ = Time.diagram(diagram, {
                x: '/counter'
            });

            Time.assertEqual(sinks.router, expected$);
        })
    );

    it(
        'should send text-to-speach request on button press',
        withTime(Time => {
            const DOM = mockDOMSource({
                '[data-action="speak"]': {
                    click: Time.diagram('--x-----x--x-')
                },
                '#text': {
                    input: Time.diagram('-----x-------', {
                        x: {
                            target: {
                                value: 'Example text'
                            }
                        }
                    })
                }
            });
            const history = xs.never();

            const sinks: any = wrapMain(Speaker)({ DOM, history } as any);
            const expected$ = Time.diagram('--x-----a--a-', {
                x: 'Edit me!',
                a: 'Example text'
            });

            Time.assertEqual(sinks.speech, expected$);
        })
    );
});
