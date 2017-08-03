// Minimal speech driver - just speech, no options or events
//
// Limited availablity see caniuse
//
// TODO Add fallback or error

import { Stream } from 'xstream';

export default function speechDriver(speechText$: Stream<string>): void {
    speechText$.addListener({
        next: what => {
            if (window.speechSynthesis !== undefined) {
                const utterance = new SpeechSynthesisUtterance(what);
                window.speechSynthesis.speak(utterance);
            }
        }
    });
}
