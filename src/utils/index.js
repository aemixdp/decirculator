import ThemeManager from './ThemeManager';
import MidiManager from './MidiManager';
import textUtils from './text';
import geometryUtils from './geometry';

export default {
    ThemeManager,
    MidiManager,
    ...textUtils,
    ...geometryUtils,
    events: {
        propagationStopper: (e) => e.stopPropagation(),
    },
}