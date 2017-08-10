// @flow

import ThemeManager from './ThemeManager';
import MidiManager from './MidiManager';
import DelayList from './DelayList';

type Point = {
    x: number;
    y: number;
};

type Shape = Point & {
    width: number;
    height: number;
}

export default {
    ThemeManager,
    MidiManager,
    DelayList,
    text: {
        snakeToCamel: (s: string) =>
            s.replace(/(-.)/g, (m) => m[1].toUpperCase()),
        offset: (n: number, ...offsets: number[]) =>
            offsets[Math.max(`${n}`.length - 1, 0)] ||
            offsets[offsets.length - 1],
    },
    geometry: {
        center: (shape: Shape, offset: Point = { x: 0, y: 0 }) => ({
            x: offset.x + shape.x + shape.width / 2,
            y: offset.y + shape.y + shape.height / 2,
        }),
    },
    events: {
        propagationStopper: (e: Event) => e.stopPropagation(),
    },
    music: {
        noteToMs: (beats: number, noteFraction: number, bpm: number) =>
            ((60000 / (bpm / 4)) / noteFraction) * beats
    }
}