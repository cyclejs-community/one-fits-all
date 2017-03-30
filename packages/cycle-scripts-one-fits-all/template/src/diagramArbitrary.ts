import { nat, tuple, array, Arbitrary } from 'jsverify';
import { Stream } from 'xstream';

function generateDiagram([intervals, endPause] : [number[], number]) : string
{
    return Array(intervals.length)
        .fill('x')
        .reduce((acc, curr, i) => {
            const pause : string[] = Array(intervals[i]).fill('-');
            return [...acc, ...pause, curr];
        }, [])
        .concat(Array(endPause).fill('-'))
        .join('');
}

function sliceDiagram(diagram : string) : [number[], number]
{
    const pauses : number[] = diagram
        .split('x')
        .map(s => s.length);

    const endPause : number = pauses[pauses.length - 1];

    return [pauses.slice(0, -1), endPause];
}

export const diagramArbitrary : Arbitrary<string> = tuple([
    array(nat),
    nat
]).smap(generateDiagram, sliceDiagram);
