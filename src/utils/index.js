import ThemeManager from './ThemeManager';
import MidiManager from './MidiManager';
import DelayList from './DelayList';

export default {
    ThemeManager,
    MidiManager,
    DelayList,
    text: {
        snakeToCamel: (string) =>
            string.replace(/(-.)/g, (m) => m[1].toUpperCase()),
        offset: (n, ...offsets) =>
            offsets[Math.max(`${n}`.length - 1, 0)] ||
            offsets[offsets.length - 1],
    },
    geometry: {
        center: (shape, offset = { x: 0, y: 0 }) => ({
            x: offset.x + shape.x + shape.width / 2,
            y: offset.y + shape.y + shape.height / 2,
        }),
    },
    events: {
        propagationStopper: (e) => e.stopPropagation(),
    },
    music: {
        noteToMs: (beats, noteFraction, bpm) =>
            ((60000 / (bpm / 4)) / noteFraction) * beats
    }
}